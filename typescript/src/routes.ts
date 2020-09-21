import { Request, Response } from 'express';

import createUser from './services/CreateUser';

export default function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name: 'André',
    email: 'andrevcv1@gmail.com',
    password: '123456',
    techs: [
      { title: 'JavaScript', experience: 100 },
      { title: 'TypeScript', experience: 100 },
      'Node.js',
      'ReactJS',
      'React Native',
    ],
  });

  return response.json({ message: 'Hello World! ' });
}
