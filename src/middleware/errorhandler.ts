export class AppError extends Error {
    public statusCode: number;
   public isOperational: boolean;
    public details?:string[];

    constructor(message: string, statusCode: number, details?: string[], isOperational=true) {
        super(message);
        this.statusCode = statusCode;
         this.isOperational = isOperational;
        this.details=details;
        // Set prototype
        Object.setPrototypeOf(this, new.target.prototype);

        //Stack Trace: Error.captureStackTrace is used to log where the error was created.
        Error.captureStackTrace(this);
    }
}

