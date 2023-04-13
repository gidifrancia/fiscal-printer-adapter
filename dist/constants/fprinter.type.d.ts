import { Fiscal } from "./fiscal.type";
export declare namespace FPrinter {
    type Config = {
        host: string;
        timeout?: number;
        deviceId?: string;
    };
    type Response = {
        ok: boolean;
        body?: any;
        original?: {
            req: any;
            res: any;
        };
    };
    abstract class Client {
        private readonly config;
        constructor(config: Config);
        getConfig(): Config;
        abstract printFiscalReceipt(receipt: Fiscal.Receipt): Promise<Response>;
        abstract printFiscalReport(report: Fiscal.Report): Promise<Response>;
        abstract printCancel(cancel: Fiscal.Cancel): Promise<Response>;
        abstract executeCommand(...commands: Fiscal.Command[]): Promise<Response>;
    }
}
