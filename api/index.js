import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';

import appRoutes from './server/src/routes/AppRoutes';

// import appRoutes, {messageControllersWithIO} from './server/src/routes/AppRoutes';
// import messageControllersWithIO from './server/src/routes/AppRoutes'

import createSocket from './server/src/core/socket'

config.config();

const app = express();
const http = createServer(app);
const io = createSocket(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

/////////////
appRoutes(app, io);

// Передаю іо в appRouter
// messageControllersWithIO(io)

// app.use('/api', appRoutes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to this API.',
}));




http.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

export default app;