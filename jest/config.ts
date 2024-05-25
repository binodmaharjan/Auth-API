process.env.NODE_ENV= 'test'
process.env.EMAIL_HOST = 'smtp.example.com'
process.env.EMAIL_PORT = '3000'
process.env.EMAIL_USER = 'sender@example.com'
process.env.EMAIL_PASS = 'email_pass'

import dbconnection from '../src/db/config'

beforeAll(async () => {
    await dbconnection.sync({ force: true });
  });
  


afterAll(async () => {
  await dbconnection.close();
});