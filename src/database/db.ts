import knex from 'knex';
import config from '../config/knexfile';

const db = knex(config.development);

export default db;
