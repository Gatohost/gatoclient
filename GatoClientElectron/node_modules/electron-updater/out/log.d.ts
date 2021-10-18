export interface Logger {
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
    debug?(message: string): void;
}
export declare class NoOpLogger implements Logger {
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
}
