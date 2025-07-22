import winston from 'winston';

export class Logger {
    private static instance: Logger;
    private readonly logger: winston.Logger;

    private constructor() {
        const transports = [];
        if (process.env.NODE_ENV !== 'production') {
            transports.push(new winston.transports.Console());
        }
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [...transports,
            new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'log/combined.log' }),
            ],
        });

    }

    public static getInstance(): Logger {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
    public object(message: any): void {
        this.logger.info(JSON.stringify(message));
    }

    public log(level: string, message: string): void {
        this.logger.log(level, message);
    }
    
}
