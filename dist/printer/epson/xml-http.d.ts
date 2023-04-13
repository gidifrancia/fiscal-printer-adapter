import { FPrinter } from "../../constants/fprinter.type";
import { Fiscal } from "../../constants/fiscal.type";
export declare class EpsonXmlHttpClient extends FPrinter.Client {
    private static XML_ROOT;
    private static XML_BODY;
    private static XML_RES_ROOT;
    private static XML_RES_BODY;
    private static XML_RESPONSE;
    private static COMMAND_CODE;
    /**
     * commercial document
     * @param receipt
     */
    printFiscalReceipt(receipt: Fiscal.Receipt): Promise<FPrinter.Response>;
    /**
     * daily closure (X and Z reports)
     * @param report
     */
    printFiscalReport(report: Fiscal.Report): Promise<FPrinter.Response>;
    /**
     * print a commercial refund/void document
     * @param cancel
     */
    printCancel(cancel: Fiscal.Cancel): Promise<FPrinter.Response>;
    /**
     * management document
     * @param nonFiscal
     */
    /**
     * fiscal document
     * @param invoice
     */
    /**
     * send Command to fiscal printer
     * @param commands
     */
    executeCommand(...commands: Fiscal.Command[]): Promise<FPrinter.Response>;
    /**
     * send to the printer server
     * @param xmlDoc
     * @returns
     */
    private send;
    /**
     * Request Message Format:
     * <?xml version="1.0" encoding="utf-8"?>
     * <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
     *      <s:Body>
     *          ...
     *      </s:Body>
     * </s:Envelope>
     * @param xmlDoc
     * @returns
     */
    private parseRequest;
    /**
     * Response Message Format:
     * <?xml version="1.0" encoding="utf-8"?>
     * <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
     *      <s:Body>
     *          <response success="true" code="" status="xxxxx" />
     *      </s:Body>
     * </s:Envelope>
     * @param xmlStr
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
