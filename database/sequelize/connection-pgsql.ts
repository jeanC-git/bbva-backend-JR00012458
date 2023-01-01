import { Sequelize } from 'sequelize';
import config from '../../config';

const DB_NAME = config.DB_NAME;
const DB_USER = config.DB_USER;


const db = new Sequelize(`postgres://${DB_USER}:@localhost:5432/${DB_NAME}`);

export default db;
