import moment from 'moment';
import pgp from 'pg-promise';
import promise from 'bluebird';
import winston from "winston";


const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.json(),
                winston.format.colorize()
            )

        }),
        new winston.transports.File({
            level: 'info',
            filename: './server.log',
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 5,
            format: winston.format.combine(
                winston.format.json(),
                winston.format.colorize()
            )

        }),
    ],
    exitOnError: false
})


interface SqlQuestOptions {
    databaseUrl: string;
    /**
     * default is 300s
     */
    MAX_SQL_EXEC_TIME?: number;

    env?: 'production' | 'development'

    /**
     * default is 300
     */
    pgMaxConnectionPool?: number;
}


export interface SqlQuest {
    any(query: string, payload: any[], correlationId: any): Promise<any>
}

// Initialize postgres database
let instance: any = null;


class SqlQuestImpl implements SqlQuest {
    private db: any
    public tx: any
    static ENV: string;
    private maxSqlExecTime = 300


    static setEnvironment(env: string) {
        this.ENV = env;
    }

    constructor(options: SqlQuestOptions) {
        if (instance === null) {
            const pg = pgp({promiseLib: promise, noWarnings: true});
            const connectionOptions = {
                connectionString: options.databaseUrl,
                max: options.pgMaxConnectionPool ?? 300
            };

            if (options.MAX_SQL_EXEC_TIME != null) {
                this.maxSqlExecTime = options.MAX_SQL_EXEC_TIME
            }

            const conn = pg(connectionOptions);
            this.db = conn;

            // don't implement this just assign same name
            this.tx = this.db.tx;

            instance = this;
        }
        return instance;
    }

    async any(query: string, payload?: any[], correlationId?: string) {
        try {
            const queryLength = query.length;
            const logSql = `DB::ANY ${query.substr(0, queryLength > 200 ? 200 : queryLength)
                .replace(/\s+/g, ' ')}${queryLength > 200 ? '...' : ''}`;

            const start = Date.now();
            let res;
            if (payload != null) {
                res = await this.db.any(query, payload);
            } else {
                res = await this.db.any(query);
            }
            const end = Date.now() - start;
            const entireLog = `[${moment().format('DD-MMM-YYYY, h:mm:ss')}
        ]${correlationId != null ? correlationId : ''} ${logSql} took ${end} MS to run`;


            logger.info(entireLog);

            if (end > this.maxSqlExecTime) {
                SqlQuestImpl.logAlert(query, end);
            }
            return res;
        } catch (ex) {
            ex.message = `POSTGRESDB::ANY::EX:: ${query.replace(/\s+/g, ' ')} ${payload} ${ex.message}`;
            throw ex;
        }
    }

    async one(query: string, payload?: any[], correlationId?: string) {
        try {
            const queryLength = query.length;
            const logSql = `DB::ANY ${query.substr(0, queryLength > 200 ? 200 : queryLength)
                .replace(/\s+/g, ' ')}${queryLength > 200 ? '...' : ''}`;

            const start = Date.now();
            let res;
            if (payload) {
                res = await this.db.one(query, payload);
            } else {
                res = await this.db.one(query);
            }
            const end = Date.now() - start;
            const entireLog = `[${moment().format('DD-MMM-YYYY, h:mm:ss')}
        ]${correlationId != null ? correlationId : ''} ${logSql} took ${end} MS to run`;

            logger.info(entireLog);

            if (end > this.maxSqlExecTime) {
                SqlQuestImpl.logAlert(query, end);
            }
            return res;
        } catch (ex) {
            ex.message = `POSTGRESDB::ANY::EX:: ${query.replace(/\s+/g, ' ')} ${payload} ${ex.message}`;
            throw ex;
        }
    }

    async oneOrNone(query: string, payload?: any[], correlationId?: string) {
        try {
            const queryLength = query.length;
            const logSql = `DB::ANY ${query.substr(0, queryLength > 200 ? 200 : queryLength)
                .replace(/\s+/g, ' ')}${queryLength > 200 ? '...' : ''}`;

            const start = Date.now();
            let res;
            if (payload) {
                res = await this.db.oneOrNone(query, payload);
            } else {
                res = await this.db.oneOrNone(query);
            }
            const end = Date.now() - start;
            const entireLog = `[${moment().format('DD-MMM-YYYY, h:mm:ss')}
        ]${correlationId != null ? correlationId : ''} ${logSql} took ${end} MS to run`;


            logger.info(entireLog);

            if (end > this.maxSqlExecTime) {
                SqlQuestImpl.logAlert(query, end);
            }
            return res;
        } catch (ex) {
            ex.message = `POSTGRESDB::ANY::EX:: ${query.replace(/\s+/g, ' ')} ${payload} ${ex.message}`;
            throw ex;
        }
    }

    async none(query: string, payload?: any[], correlationId?: string) {
        try {
            const queryLength = query.length;
            const logSql = `DB::ANY ${query.substr(0, queryLength > 200 ? 200 : queryLength)
                .replace(/\s+/g, ' ')}${queryLength > 200 ? '...' : ''}`;

            const start = Date.now();
            let res;
            if (payload) {
                res = await this.db.none(query, payload);
            } else {
                res = await this.db.none(query);
            }
            const end = Date.now() - start;
            const entireLog = `[${moment().format('DD-MMM-YYYY, h:mm:ss')}]
      ${correlationId != null ? correlationId : ''} ${logSql} took ${end} MS to run`;

            logger.info(entireLog);

            if (end > this.maxSqlExecTime) {
                SqlQuestImpl.logAlert(query, end);
            }
            return res;
        } catch (ex) {
            ex.message = `POSTGRESDB::ANY::EX:: ${query.replace(/\s+/g, ' ')} ${payload} ${ex.message}`;
            throw ex;
        }
    }

    async manyOrNone(query: string, payload?: any[], correlationId?: string) {
        try {
            const queryLength = query.length;
            const logSql = `DB::ANY ${query.substr(0, queryLength > 200 ? 200 : queryLength)
                .replace(/\s+/g, ' ')}${queryLength > 200 ? '...' : ''}`;

            const start = Date.now();
            let res;
            if (payload) {
                res = await this.db.manyOrNone(query, payload);
            } else {
                res = await this.db.manyOrNone(query);
            }
            const end = Date.now() - start;
            const entireLog = `[${moment().format('DD-MMM-YYYY, h:mm:ss')}]
        ${correlationId != null ? correlationId : ''} ${logSql} took ${end} MS to run`;


            logger.info(entireLog);

            if (end > this.maxSqlExecTime) {
                SqlQuestImpl.logAlert(query, end);
            }
            return res;
        } catch (ex) {
            ex.message = `POSTGRESDB::ANY::EX:: ${query.replace(/\s+/g, ' ')} ${payload} ${ex.message}`;
            throw ex;
        }
    }

    static logAlert(sql: string, time: number) {
        try {
            const queryLength = sql.length;
            const truncatedSql = `${sql.substr(0, queryLength > 300 ? 300 : queryLength)
                .replace(/\s+/g, ' ')}${queryLength > 200 ? '...' : ''}`;
            const timeLog = `Execution Time: ${time} MS SQL Query: `;
            let subject = 'Development - SQL Alert';

            let log = `${subject} ${timeLog}`;
            if (SqlQuestImpl.ENV === 'production') {
                subject = 'Production - SQL Alert for testing';
                logger.info(`${log} ${sql}`);
            }

            log = `${log} ${truncatedSql}`;

            logger.info(log);

            return true;
        } catch (ex) {
            logger.error(`SqlQuestImpl.logAlert:: ${ex}`);
            return true;
        }
    }
}


export default function sqlQuestFactory(options: SqlQuestOptions) {

    if (options.env == null) {
        options.env = 'development'
    }

    SqlQuestImpl.setEnvironment(options.env)

    return new SqlQuestImpl(options)
}

