import { Request, Response } from 'express';
import pagarme from 'pagarme';

import { Status } from '@prisma/client';

import AppError from '~/errors/AppError';
import SubscriptionsRepository from '~/repositories/SubscriptionsRepository';
import UsersRepository from '~/repositories/UsersRepository';
import VerifyPagarMePostbackSignature from '~/services/VerifyPagarMePostbackSignature';

class SubscriptionsController {
  async index(_request: Request, response: Response) {
    const subscriptions = await SubscriptionsRepository.findAll();

    return response.json(subscriptions);
  }

  async create(request: Request, response: Response) {
    const { checkout_json } = request.body;

    const checkout = JSON.parse(checkout_json);

    try {
      const client = await pagarme.client.connect({
        api_key: String(process.env.PAGARME_API_KEY),
      });

      const subscription = await client.subscriptions.create({
        plan_id: 488371,
        postback_url: String(process.env.PAGARME_POSTBACK_URL),
        card_hash: checkout.card_hash,
        payment_method: checkout.payment_method,
        customer: checkout.customer,
      });

      const user = await UsersRepository.findByEmail(checkout.customer.email);

      await SubscriptionsRepository.create({
        profile: user && { connect: { id: user.profile.id } },
        subscription_id: subscription.id,
        email: checkout.customer.email,
        status: String(
          subscription.current_transaction.status,
        ).toUpperCase() as Status,
        checkout_json,
        subscription_json: JSON.stringify(subscription),
      });

      return response.json({ subscription, checkout });
    } catch {
      throw new AppError(
        'It was not possible to create subscription on Pagar.me',
        500,
      );
    }
  }

  async postback(request: Request, response: Response) {
    const signature = request.headers['x-hub-signature'];

    if (!signature) {
      throw new AppError('Signature not found.', 400);
    }

    const verifySignature = new VerifyPagarMePostbackSignature();

    const isValid = verifySignature.execute({
      signature: String(signature),
      body: request.body,
    });

    if (!isValid) {
      throw new AppError('Invalid signature.', 401);
    }

    const { id, current_status } = request.body;

    const subscription = await SubscriptionsRepository.findBySubscriptionId(
      Number(id),
    );

    if (!subscription) {
      throw new AppError('No subscription found with this ID.', 404);
    }

    const status = String(current_status).toUpperCase() as Status;

    const postbackJson = {
      status,
      headers: request.headers,
      body: request.body,
    };

    await SubscriptionsRepository.update(subscription.id, {
      status,
      postbacks_json: {
        set: [...subscription.postbacks_json, JSON.stringify(postbackJson)],
      },
    });

    const userId = subscription.profile?.user_id;

    const user = await UsersRepository.findById(userId as string);

    if (!userId || !user) {
      throw new AppError('No user found for this subscription.', 404);
    }

    if (status === 'PAID') {
      if (user.profile.roles.includes('VIP')) {
        throw new AppError('User already has VIP role.', 409);
      }

      await UsersRepository.update(userId, {
        profile: {
          update: {
            roles: {
              set: [...user.profile.roles, 'VIP'],
            },
          },
        },
      });
    } else {
      await UsersRepository.update(userId, {
        profile: {
          update: {
            roles: {
              set: user.profile.roles.filter(role => role !== 'VIP'),
            },
          },
        },
      });
    }

    return response.sendStatus(200);
  }
}

export default new SubscriptionsController();
