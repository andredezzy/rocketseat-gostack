import express from 'express';

import routes from './routes';

const app = express();

app.get('/', routes);

app.listen(3333);
