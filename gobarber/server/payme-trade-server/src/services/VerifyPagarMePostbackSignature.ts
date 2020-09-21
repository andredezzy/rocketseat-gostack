import pagarme from 'pagarme';
import qs from 'qs';

interface Request {
  signature: string;
  body: any;
}

class VerifyPagarMePostbackSignature {
  async execute({ signature, body }: Request): Promise<boolean> {
    const isValid = await pagarme.postback.verifySignature(
      String(process.env.PAGARME_API_KEY),
      qs.stringify(body),
      signature.replace('sha1=', ''),
    );

    return isValid;
  }
}

export default VerifyPagarMePostbackSignature;
