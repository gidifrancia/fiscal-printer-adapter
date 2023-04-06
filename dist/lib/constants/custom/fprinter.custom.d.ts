import { CustomProtocol } from "./custom.type";
export declare namespace FPrinterCustom {
    type Config = {
        host: string;
        fiscalId?: string;
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
        abstract printFiscalReceipt(receipt: CustomProtocol.Receipt): Promise<Response>;
        abstract printFiscalReport(report: CustomProtocol.Report): Promise<Response>;
        abstract printCancel(cancel: CustomProtocol.Cancel): Promise<Response>;
        abstract executeCommand(...commands: CustomProtocol.Command[]): Promise<Response>;
    }
}
