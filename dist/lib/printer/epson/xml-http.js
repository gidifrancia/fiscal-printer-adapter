"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpsonXmlHttpClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const fprinter_type_1 = require("../../constants/fprinter.type");
const xmlbuilder = tslib_1.__importStar(require("xmlbuilder"));
const xml2js_1 = require("xml2js");
const fiscal_type_1 = require("../../constants/fiscal.type");
class EpsonXmlHttpClient extends fprinter_type_1.FPrinter.Client {
    /**
     * commercial document
     * @param receipt
     */
    async printFiscalReceipt(receipt) {
        const xmlDoc = this.convertReceiptToXmlDoc(receipt);
        return this.send(xmlDoc);
    }
    /**
     * daily closure (X and Z reports)
     * @param report
     */
    async printFiscalReport(report) {
        const xmlDoc = this.convertReportToXmlDoc(report);
        return this.send(xmlDoc);
    }
    /**
     * print a commercial refund/void document
     * @param cancel
     */
    async printCancel(cancel) {
        const xmlDoc = this.convertCancelToXmlDoc(cancel);
        return this.send(xmlDoc);
    }
    /**
     * management document
     * @param nonFiscal
     */
    // async printNonFiscal(nonFiscal: Fiscal.NonFiscal): Promise<FPrinter.Response> {
    //     const xmlDoc = this.convertNonFiscalToXmlDoc(nonFiscal);
    //     return this.send(xmlDoc);
    // }
    /**
     * fiscal document
     * @param invoice
     */
    // async printInvoice(invoice: Fiscal.Invoice): Promise<FPrinter.Response> {
    //     const xmlDoc = this.convertInvoiceToXmlDoc(invoice);
    //     return this.send(xmlDoc);
    // }
    /**
     * send Command to fiscal printer
     * @param commands
     */
    async executeCommand(...commands) {
        const xmlDoc = this.convertCommandToXmlDoc(...commands);
        return this.send(xmlDoc);
    }
    // *********************
    // Emitter
    // *********************
    /**
     * send to the printer server
     * @param xmlDoc
     * @returns
     */
    async send(xmlDoc) {
        // build the printer server url based on config
        const config = this.getConfig();
        let url = `http://${config.host}/cgi-bin/fpmate.cgi`;
        let prefix = '?';
        if (config.deviceId) {
            url += `${prefix}devid=${config.deviceId}`;
            prefix = '&';
        }
        if (config.timeout && config.timeout > 0) {
            url += `${prefix}timeout=${config.timeout}`;
        }
        // build xml string
        const xmlStr = this.parseRequest(xmlDoc);
        // send
        const resXmlStr = await new Promise((resolve, reject) => {
            axios_1.default.post(url, xmlStr, {
                headers: {
                    'Content-Type': 'text/xml;charset=utf-8'
                }
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((err) => {
                reject(err);
            });
        });
        const response = await this.parseResponse(resXmlStr);
        response.original = {
            req: xmlStr,
            res: resXmlStr
        };
        return response;
    }
    // *********************
    // Parsers
    // *********************
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
    parseRequest(xmlDoc) {
        const reqXmlStr = xmlbuilder
            .create(EpsonXmlHttpClient.XML_ROOT, { version: '1.0', encoding: 'utf-8' })
            .att('xmlns:s', 'http://schemas.xmlsoap.org/soap/envelope/')
            .ele(EpsonXmlHttpClient.XML_BODY)
            .importDocument(xmlDoc)
            .end({ pretty: true });
        return reqXmlStr;
    }
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
    async parseResponse(xmlStr) {
        // create xml parser
        let response;
        // explicitArray: Always put child nodes in an array if true; otherwise an array is created only if there is more than one.
        // mergeAttrs: Merge attributes and child elements as properties of the parent, instead of keying attributes off a child attribute object.
        const parser = new xml2js_1.Parser({ explicitArray: false, mergeAttrs: true });
        // parse to object
        const xmlObj = await parser.parseStringPromise(xmlStr);
        if (xmlObj && xmlObj[EpsonXmlHttpClient.XML_RES_ROOT] && xmlObj[EpsonXmlHttpClient.XML_RES_ROOT][EpsonXmlHttpClient.XML_RES_BODY]) {
            // get response data
            response = xmlObj[EpsonXmlHttpClient.XML_RES_ROOT][EpsonXmlHttpClient.XML_RES_BODY][EpsonXmlHttpClient.XML_RESPONSE];
        }
        return {
            ok: response && response.success === 'true' ? true : false,
            body: response || {}
        };
    }
    // *********************
    // Converters
    // *********************
    /**
     * convert `Fiscal.Receipt` to the object that xml2js builder and cgi server supports.
     * @param receipt
     * @returns
     */
    convertReceiptToXmlDoc(receipt) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33;
        // init
        const printerFiscalReceipt = xmlbuilder.create('printerFiscalReceipt');
        // begin
        printerFiscalReceipt.ele('beginFiscalReceipt', { operator: (_a = receipt.operator) !== null && _a !== void 0 ? _a : 1 });
        // sales
        for (const row in receipt.rows) {
            const receiptRow = row;
            if (receiptRow.sale) {
                const sale = receiptRow.sale;
                if (sale.type === fiscal_type_1.Fiscal.ItemType.HOLD) {
                    // item adjustment
                    if (sale.operations && sale.operations.length > 0) {
                        for (const operation of sale.operations) {
                            printerFiscalReceipt.ele('printRecItemAdjustment', {
                                operator: (_b = operation.operator) !== null && _b !== void 0 ? _b : 1,
                                description: (_c = operation.description) !== null && _c !== void 0 ? _c : '',
                                department: (_d = operation.department) !== null && _d !== void 0 ? _d : 1,
                                justification: (_e = operation.justification) !== null && _e !== void 0 ? _e : 1,
                                amount: operation.amount,
                                adjustmentType: ((t) => {
                                    switch (t) {
                                        case 0:
                                            return 0;
                                        case 1:
                                            return 3;
                                        case 4:
                                            return 5;
                                        case 5:
                                            return 8;
                                        case 8:
                                            return 10;
                                        case 9:
                                            return 11;
                                        case 10:
                                            return 12;
                                        default:
                                            return 0;
                                    }
                                })(operation.type)
                            });
                        }
                    }
                    // item
                    printerFiscalReceipt.ele('printRecItem', {
                        operator: (_f = sale.operator) !== null && _f !== void 0 ? _f : 1,
                        description: (_g = sale.description) !== null && _g !== void 0 ? _g : '',
                        quantity: sale.quantity,
                        unitPrice: sale.unitPrice,
                        department: (_h = sale.department) !== null && _h !== void 0 ? _h : 1,
                        justification: (_j = sale.justification) !== null && _j !== void 0 ? _j : 1
                    });
                }
                else if (sale.type === fiscal_type_1.Fiscal.ItemType.CANCEL) {
                    // void item adjustment
                    if (sale.operations && sale.operations.length > 0) {
                        for (const operation of sale.operations) {
                            printerFiscalReceipt.ele('printRecItemAdjustmentVoid', {
                                operator: (_k = operation.operator) !== null && _k !== void 0 ? _k : 1
                            });
                        }
                    }
                    // void item
                    printerFiscalReceipt.ele('printRecItemVoid', {
                        operator: (_l = sale.operator) !== null && _l !== void 0 ? _l : 1,
                        description: (_m = sale.description) !== null && _m !== void 0 ? _m : '',
                        quantity: sale.quantity,
                        unitPrice: sale.unitPrice,
                        department: (_o = sale.department) !== null && _o !== void 0 ? _o : 1,
                        justification: (_p = sale.justification) !== null && _p !== void 0 ? _p : 1
                    });
                }
            }
            if (receiptRow.barcode) {
                printerFiscalReceipt.ele('printBarCode', {
                    operator: (_q = receiptRow.barcode.operator) !== null && _q !== void 0 ? _q : 1,
                    position: (_r = receiptRow.barcode.position) !== null && _r !== void 0 ? _r : 900,
                    width: (_s = receiptRow.barcode.width) !== null && _s !== void 0 ? _s : 1,
                    height: (_t = receiptRow.barcode.height) !== null && _t !== void 0 ? _t : 1,
                    hRIPosition: (_u = receiptRow.barcode.hriPosition) !== null && _u !== void 0 ? _u : 0,
                    hRIFont: (_v = receiptRow.barcode.hriFont) !== null && _v !== void 0 ? _v : 'A',
                    codeType: (_w = receiptRow.barcode.type) !== null && _w !== void 0 ? _w : 'CODE128',
                    code: (_x = receiptRow.barcode.data) !== null && _x !== void 0 ? _x : ''
                });
            }
            if (receiptRow.qrCode) {
                printerFiscalReceipt.ele('printBarCode', {
                    operator: (_y = receiptRow.qrCode.operator) !== null && _y !== void 0 ? _y : 1,
                    qRCodeAlignment: (_z = receiptRow.qrCode.alignment) !== null && _z !== void 0 ? _z : 0,
                    qRCodeSize: (_0 = receiptRow.qrCode.size) !== null && _0 !== void 0 ? _0 : 1,
                    qRCodeErrorCorrection: (_1 = receiptRow.qrCode.errorCorrection) !== null && _1 !== void 0 ? _1 : 0,
                    codeType: (_2 = receiptRow.qrCode.type) !== null && _2 !== void 0 ? _2 : 'CODE128',
                    code: (_3 = receiptRow.qrCode.data) !== null && _3 !== void 0 ? _3 : ''
                });
            }
            if (receiptRow.graphicCoupon) {
                printerFiscalReceipt.ele('printGraphicCoupon', {
                    operator: (_4 = receiptRow.graphicCoupon.operator) !== null && _4 !== void 0 ? _4 : 1,
                    graphicFormat: (_5 = receiptRow.graphicCoupon.format) !== null && _5 !== void 0 ? _5 : 'B'
                }, (_6 = receiptRow.graphicCoupon.value) !== null && _6 !== void 0 ? _6 : '');
            }
            if (receiptRow.message) {
                const { message = '', messageType = receiptRow.message.messageType, index = 1 } = receiptRow.message;
                printerFiscalReceipt.ele('printRecMessage', {
                    message,
                    messageType,
                    index,
                    operator: (_7 = receiptRow.message.operator) !== null && _7 !== void 0 ? _7 : 1,
                });
            }
            if (receiptRow.lottery) {
                printerFiscalReceipt.ele('printRecLotteryID', {
                    operator: (_8 = receiptRow.lottery.operator) !== null && _8 !== void 0 ? _8 : 1,
                    code: receiptRow.lottery.code
                });
            }
            if (receiptRow.refund) {
                const refund = receiptRow.refund;
                if (refund.type === fiscal_type_1.Fiscal.ItemType.HOLD) {
                    if (refund.operation) {
                        printerFiscalReceipt.ele('printRecRefund', {
                            operator: (_9 = refund.operator) !== null && _9 !== void 0 ? _9 : 1,
                            description: (_10 = refund.description) !== null && _10 !== void 0 ? _10 : '',
                            operationType: ((t) => {
                                switch (t) {
                                    case 8:
                                        return 10;
                                    case 9:
                                        return 11;
                                    case 10:
                                        return 12;
                                    default:
                                        return 10;
                                }
                            })(refund.type),
                            amount: (_11 = refund.amount) !== null && _11 !== void 0 ? _11 : 0,
                            department: (_12 = refund.department) !== null && _12 !== void 0 ? _12 : 1,
                            justification: (_13 = refund.justification) !== null && _13 !== void 0 ? _13 : 1
                        });
                    }
                    else {
                        printerFiscalReceipt.ele('printRecRefund', {
                            operator: (_14 = refund.operator) !== null && _14 !== void 0 ? _14 : 1,
                            description: (_15 = refund.description) !== null && _15 !== void 0 ? _15 : '',
                            quantity: (_16 = refund.quantity) !== null && _16 !== void 0 ? _16 : 1,
                            unitPrice: (_17 = refund.unitPrice) !== null && _17 !== void 0 ? _17 : 0,
                            department: (_18 = refund.department) !== null && _18 !== void 0 ? _18 : 1,
                            justification: (_19 = refund.justification) !== null && _19 !== void 0 ? _19 : 1
                        });
                    }
                }
                else if (refund.type === fiscal_type_1.Fiscal.ItemType.CANCEL) {
                    printerFiscalReceipt.ele('printRecRefundVoid', {
                        operator: (_20 = refund.operation) !== null && _20 !== void 0 ? _20 : 1
                    });
                }
            }
            if (receiptRow.subtotal) {
                const subtotal = receiptRow.subtotal;
                if (subtotal.type === fiscal_type_1.Fiscal.ItemType.HOLD) {
                    if (subtotal.operations && subtotal.operations.length > 0) {
                        for (const operation of subtotal.operations) {
                            printerFiscalReceipt.ele('printRecSubtotalAdjustment', {
                                operator: (_21 = operation.operator) !== null && _21 !== void 0 ? _21 : 1,
                                description: (_22 = operation.description) !== null && _22 !== void 0 ? _22 : '',
                                amount: operation.amount,
                                justification: (_23 = operation.justification) !== null && _23 !== void 0 ? _23 : 1,
                                adjustmentType: ((t) => {
                                    switch (t) {
                                        case 2:
                                            return 1;
                                        case 3:
                                            return 2;
                                        case 6:
                                            return 6;
                                        case 7:
                                            return 7;
                                        default:
                                            return 1;
                                    }
                                })(operation.type)
                            });
                        }
                    }
                    printerFiscalReceipt.ele('printRecSubtotal', {
                        operator: (_24 = subtotal.operator) !== null && _24 !== void 0 ? _24 : 1,
                        option: subtotal.option
                    });
                }
                else if (subtotal.type === fiscal_type_1.Fiscal.ItemType.CANCEL) {
                    if (subtotal.operations && subtotal.operations.length > 0) {
                        for (const operation of subtotal.operations) {
                            printerFiscalReceipt.ele('printRecSubtotalAdjustVoid', {
                                operator: (_25 = operation.operator) !== null && _25 !== void 0 ? _25 : 1
                            });
                        }
                    }
                }
            }
            if (receiptRow.payment) {
                const payment = receiptRow.payment;
                printerFiscalReceipt.ele('printRecTotal', {
                    operator: (_26 = payment.operator) !== null && _26 !== void 0 ? _26 : 1,
                    description: (_27 = payment.description) !== null && _27 !== void 0 ? _27 : '',
                    payment: (_28 = payment.payment) !== null && _28 !== void 0 ? _28 : 0,
                    paymentType: (_29 = payment.paymentType) !== null && _29 !== void 0 ? _29 : 0,
                    index: (_30 = payment.index) !== null && _30 !== void 0 ? _30 : 1,
                    justification: (_31 = payment.justification) !== null && _31 !== void 0 ? _31 : 1
                });
            }
        }
        // end
        printerFiscalReceipt.ele('endFiscalReceipt', { operator: (_32 = receipt.operator) !== null && _32 !== void 0 ? _32 : 1 });
        // openDrawer
        if (receipt.openDrawer) {
            printerFiscalReceipt.ele('openDrawer', {
                operator: (_33 = receipt.openDrawer.operator) !== null && _33 !== void 0 ? _33 : 1
            });
        }
        return printerFiscalReceipt;
    }
    /**
     * convert `Fiscal.Report` to the object that printer server supports.
     * @param report
     * @returns
     */
    convertReportToXmlDoc(report) {
        var _a, _b, _c, _d, _e;
        const printerFiscalReport = xmlbuilder.create('printerFiscalReport');
        if (report.type === fiscal_type_1.Fiscal.ReportType.DAILY_FINANCIAL_REPORT) {
            printerFiscalReport.ele('printXReport', {
                operator: (_a = report.operator) !== null && _a !== void 0 ? _a : 1
            });
        }
        else if (report.type === fiscal_type_1.Fiscal.ReportType.DAILY_FISCAL_CLOUSE) {
            printerFiscalReport.ele('printZReport', {
                operator: (_b = report.operator) !== null && _b !== void 0 ? _b : 1,
                timeout: (_c = report.timeout) !== null && _c !== void 0 ? _c : 6000
            });
        }
        else if (report.type === fiscal_type_1.Fiscal.ReportType.ALL) {
            printerFiscalReport.ele('printXZReport', {
                operator: (_d = report.operator) !== null && _d !== void 0 ? _d : 1,
                timeout: (_e = report.timeout) !== null && _e !== void 0 ? _e : 12000
            });
        }
        return printerFiscalReport;
    }
    /**
     * convert `Fiscal.Cancel` to the object that printer server supports.
     * @param cancel
     * @returns
     */
    convertCancelToXmlDoc(cancel) {
        var _a;
        const printerFiscalReceipt = xmlbuilder.create('printerFiscalReceipt');
        printerFiscalReceipt.ele('printRecMessage', {
            operator: (_a = cancel.operator) !== null && _a !== void 0 ? _a : 1,
            messageType: '4',
            message: `${cancel.type} ${cancel.zRepNum} ${cancel.docNum} ${cancel.date} ${cancel.fiscalNum}`
        });
        return printerFiscalReceipt;
    }
    /**
     * convert `Fiscal.NonFiscal` to the object that printer server supports.
     * @param nonFiscal
     * @returns
     */
    // private convertNonFiscalToXmlDoc(nonFiscal: Fiscal.NonFiscal): xmlbuilder.XMLDocument { }
    /**
     * convert `Fiscal.Invoice` to the object that printer server supports.
     * @param invoice
     * @returns
     */
    // private convertInvoiceToXmlDoc(invoice: Fiscal.Invoice): xmlbuilder.XMLDocument { }
    /**
     * convert `Fiscal.Command` to the object that printer server supports.
     * @param commands
     * @returns
     */
    convertCommandToXmlDoc(...commands) {
        const printerCommand = xmlbuilder.create(commands.length > 1 ? 'printerCommands' : 'printerCommand');
        for (const command of commands) {
            if (EpsonXmlHttpClient.COMMAND_CODE[command.code]) {
                EpsonXmlHttpClient.COMMAND_CODE[command.code](printerCommand, command);
            }
        }
        return printerCommand;
    }
}
exports.EpsonXmlHttpClient = EpsonXmlHttpClient;
EpsonXmlHttpClient.XML_ROOT = 's:Envelope';
EpsonXmlHttpClient.XML_BODY = 's:Body';
EpsonXmlHttpClient.XML_RES_ROOT = 'soapenv:Envelope';
EpsonXmlHttpClient.XML_RES_BODY = 'soapenv:Body';
EpsonXmlHttpClient.XML_RESPONSE = 'response';
EpsonXmlHttpClient.COMMAND_CODE = {
    [fiscal_type_1.Fiscal.CommandCode.OPEN_DRAWER]: (printerCommand, command) => {
        var _a, _b;
        printerCommand.ele('openDrawer', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1
        });
    },
    [fiscal_type_1.Fiscal.CommandCode.QUERY_PRINTER_STATUS]: (printerCommand, command) => {
        var _a, _b, _c, _d;
        printerCommand.ele('queryPrinterStatus', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1,
            statusType: (_d = (_c = command.data) === null || _c === void 0 ? void 0 : _c.statusType) !== null && _d !== void 0 ? _d : 0
        });
    },
    [fiscal_type_1.Fiscal.CommandCode.REBOOT_WEB_SERVER]: (printerCommand, command) => {
        var _a, _b;
        printerCommand.ele('rebootWebServer', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1
        });
    },
    [fiscal_type_1.Fiscal.CommandCode.RESET_PRINTER]: (printerCommand, command) => {
        var _a, _b;
        printerCommand.ele('resetPrinter', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1
        });
    },
    [fiscal_type_1.Fiscal.CommandCode.GET_NATIVE_CODE_FUNCTION]: (printerCommand, command) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        printerCommand.ele('directIO', {
            command: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : '0000',
            data: (_d = (_c = command.data) === null || _c === void 0 ? void 0 : _c.operator) !== null && _d !== void 0 ? _d : '01',
            timeout: (_f = (_e = command.data) === null || _e === void 0 ? void 0 : _e.timeout) !== null && _f !== void 0 ? _f : '6000',
            comment: (_h = (_g = command.data) === null || _g === void 0 ? void 0 : _g.comment) !== null && _h !== void 0 ? _h : ''
        });
    },
    [fiscal_type_1.Fiscal.CommandCode.DISPLAY_TEXT]: (printerCommand, command) => {
        var _a, _b, _c, _d;
        printerCommand.ele('displayText', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1,
            data: (_d = (_c = command.data) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : ''
        });
    },
    [fiscal_type_1.Fiscal.CommandCode.PRINT_CONTENT_BY_NUMBERS]: (printerCommand, command) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        printerCommand.ele('printContentByNumbers', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1,
            dataType: (_d = (_c = command.data) === null || _c === void 0 ? void 0 : _c.dataType) !== null && _d !== void 0 ? _d : fiscal_type_1.Fiscal.DataType.COMMERCIAL_DOCS,
            day: ((_e = command.data) === null || _e === void 0 ? void 0 : _e.day) || '',
            month: ((_f = command.data) === null || _f === void 0 ? void 0 : _f.month) || '',
            year: ((_g = command.data) === null || _g === void 0 ? void 0 : _g.year) || '',
            fromNumber: ((_h = command.data) === null || _h === void 0 ? void 0 : _h.fromNumber) || '',
            toNumber: ((_j = command.data) === null || _j === void 0 ? void 0 : _j.toNumber) || '',
        });
    }
};
//# sourceMappingURL=xml-http.js.map