import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

export async function getConnection() {
  try {
    return await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      charset: 'UTF8'
    });
  } catch (error) {
    console.error('Error conectando a Oracle Database:', error);
    throw error;
  }
}