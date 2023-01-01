import { Sequelize } from 'sequelize';
import config from '../../config';

const DB_NAME = config.DB_NAME;


const db = new Sequelize(`postgres://postgres:@localhost:5432/${DB_NAME}`);

export default db;
