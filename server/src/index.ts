import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectionRouter from './routes/connection.routes';
import credentialRouter from './routes/credential.routes';
import otpRouter from './routes/otp.routes';
import webhookRouter from './routes/webhook.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(cookieParser())
app.use(express.json());

app.use(cors(
  {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.0.111:3001'], // Be more specific in production
    credentials: true, //access-control-allow-credentials:true (make this true if client make request with credential)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }
));

// create intivation
// issue credential
// send conn-less proof request

app.use('/connection', connectionRouter);
app.use('/credential', credentialRouter);
app.use('/otp', otpRouter);
app.use('/webhooks', webhookRouter);



app.listen(5000, async ()=> {
  console.log('server started at port 5000');
})