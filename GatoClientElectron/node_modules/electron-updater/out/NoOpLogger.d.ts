import { Logger } from "./main";
export declare class NoOpLogger implements Logger {
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
}
