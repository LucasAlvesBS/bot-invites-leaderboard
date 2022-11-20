import { createConnection } from 'typeorm';

createConnection()
  .then(() => console.log('✅ Conectado ao Postgres com sucesso!'))
  .catch(error =>
    console.log('❌ Falha ao conectar com o banco de dados.', error),
  );
