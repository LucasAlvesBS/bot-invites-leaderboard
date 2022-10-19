import { credentials } from '@config/credentials';
import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  await mongoose
    .connect(credentials.databaseUrl)
    .then(() => {
      console.log('Conectado ao MongoDB');
    })
    .catch(() => {
      console.log('Ocorreu um erro ao tentar conectar ao MongoDB');
    });
};
