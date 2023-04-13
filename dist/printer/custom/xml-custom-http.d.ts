import { FPrinterCustom } from "../../constants/custom/fprinter.custom";
import { CustomProtocol } from "../../constants/custom/custom.type";
export declare class CustomXmlHttpClient extends FPrinterCustom.Client {
    private static XML_RESPONSE;
    private static INFO_XML_RESPONSE;
    private static XML_HEADER;
    private static COMMAND_CODE;
    /**
     * commercial document
     * @param receipt
     */
    printFiscalReceipt(receipt: CustomProtocol.Receipt): Promise<FPrinterCustom.Response>;
    /**
     * daily closure (X and Z reports)
     * @param report
     */
    printFiscalReport(report: CustomProtocol.Report): Promise<FPrinterCustom.Response>;
    /**
     * print a commercial refund/void document
     * @param cancel
     */
    printCancel(cancel: CustomProtocol.Cancel): Promise<FPrinterCustom.Response>;
    /**
     * send Command to fiscal printer
     * @param commands
     */
    executeCommand(...commands: CustomProtocol.Command[]): Promise<FPrinterCustom.Response>;
    /**
     * send to the printer server
     * @param xmlDoc
     * @returns
     */
    private send;
    /**
     * Request Message Format:
     * <?xml version: '1.0', encoding: 'utf-8', standalone: 'yes'?>
     * <printerCommand>
     *  <queryPrinterStatus></queryPrinterStatus>
     * </printerCommand>
     * @param xmlDoc
     * @returns
     */
    private parseRequest;
    /**
     * Response Message Format:
     * success = "true" | "false"; status = if error return "error code", else return '0';
     *
     * <?xml version="1.0" encoding="utf-8"?>
     *   <response success="" status="">
     *      <addInfo>
     *          ...
     *      </addInfo>
     *   </response>
     * @param xmlStr
     * @param isGetInfo if exce
     */
    private parseResponse;
    /**
     * convert `Fiscal.Receipt` to the object that xml2js builder and cgi server supports.
     * @param receipt
     * @returns
     */
    private convertReceiptToXmlDoc;
    /**
     * convert `Fiscal.Report` to the object that printer server supports.
     * @param report
     * @returns
     */
    private convertReportToXmlDoc;
    /**
     * convert `Fiscal.Cancel` to the object that printer server supports.
     * @param cancel
     * @returns
     */
    private convertCancelToXmlDoc;
    /**
     * convert `Fiscal.NonFiscal` to the object that printer server supports.
     * @param nonFiscal
     * @returns
     */
    /**
     * convert `Fiscal.Invoice` to the object that printer server supports.
     * @param invoice
     * @returns
     */
    /**
     * convert `Fiscal.Command` to the object that printer server supports.
     * @param commands
     * @returns
     */
    private convertCommandToXmlDoc;
}
