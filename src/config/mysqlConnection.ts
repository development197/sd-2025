import mysql from 'mysql2/promise'
// import config from '../config/config';

const db = mysql.createPool({
    host: '173.231.207.59',
    user: 'priyankadinodiya_worksuite',
    password: '$RYJWDYX$se}',
    database: 'priyankadinodiya_worksuite'
})

export default db
