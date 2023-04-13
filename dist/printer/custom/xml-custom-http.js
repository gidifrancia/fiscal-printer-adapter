"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomXmlHttpClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const xmlbuilder = tslib_1.__importStar(require("xmlbuilder"));
const xml2js_1 = require("xml2js");
const fprinter_custom_1 = require("../../constants/custom/fprinter.custom");
const custom_type_1 = require("../../constants/custom/custom.type");
class CustomXmlHttpClient extends fprinter_custom_1.FPrinterCustom.Client {
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
     * send Command to fiscal printer
     * @param commands
     */
    async executeCommand(...commands) {
        const xmlDoc = this.convertCommandToXmlDoc(...commands);
        const isGetInfo = !!commands.length && (commands[0].code === custom_type_1.CustomProtocol.CommandCode.GET_INFO);
        return this.send(xmlDoc, isGetInfo);
    }
    // *********************
    // Emitter
    // *********************
    /**
     * send to the printer server
     * @param xmlDoc
     * @returns
     */
    async send(xmlDoc, isGetInfo) {
        // build the printer server url based on config
        const config = this.getConfig();
        let url = `http://${config.host}/xml/printer.htm`;
        // build xml string
        const xmlStr = this.parseRequest(xmlDoc);
        const headers = {
            'Content-Type': 'text/plain',
            'authorization': `Basic ${Buffer.from(`${config.fiscalId || ''}:${config.fiscalId || ''}`).toString('base64')}`
        };
        // send	
        const resXmlStr = await new Promise((resolve, reject) => {
            axios_1.default
                .post(url, xmlStr, {
                headers
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((err) => {
                reject(err);
            });
        });
        const response = await this.parseResponse(resXmlStr, isGetInfo);
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
     * <?xml version: '1.0', encoding: 'utf-8', standalone: 'yes'?>
     * <printerCommand>
     *  <queryPrinterStatus></queryPrinterStatus>
     * </printerCommand>
     * @param xmlDoc
     * @returns
     */
    parseRequest(xmlDoc) {
        const reqXmlStr = xmlDoc.end({ pretty: true });
        return reqXmlStr;
    }
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
    async parseResponse(xmlStr, isGetInfo) {
        // create xml parser
        let response;
        // explicitArray: Always put child nodes in an array if true; otherwise an array is created only if there is more than one.
        // mergeAttrs: Merge attributes and child elements as properties of the parent, instead of keying attributes off a child attribute object.
        const parser = new xml2js_1.Parser({ explicitArray: false, mergeAttrs: true });
        // parse to object
        const xmlObj = await parser.parseStringPromise(xmlStr);
        if (xmlObj && Object.keys(xmlObj).length) {
            // get response data
            response = xmlObj[isGetInfo ? CustomXmlHttpClient.INFO_XML_RESPONSE : CustomXmlHttpClient.XML_RESPONSE];
        }
        return {
            ok: !!response && response.success === 'true',
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        // init
        const printerFiscalReceipt = xmlbuilder.create('printerFiscalReceipt', CustomXmlHttpClient.XML_HEADER);
        // begin
        printerFiscalReceipt.ele('beginFiscalReceipt');
        if (receipt.beginDisplayText) {
            printerFiscalReceipt.ele('displayText', {
                data: receipt.beginDisplayText.data || ''
            });
        }
        // lottery
        if (receipt.lottery && receipt.lottery.code) {
            printerFiscalReceipt.ele('setLotteryCode', {
                code: receipt.lottery.code
            });
        }
        // sales item
        if (receipt.sales && receipt.sales.length > 0) {
            for (const sale of receipt.sales) {
                const commonSale = {
                    description: sale.description || '',
                    quantity: sale.quantity,
                    unitPrice: sale.unitPrice,
                    department: (_a = sale.department) !== null && _a !== void 0 ? _a : 1,
                };
                sale.idVat !== void 0 && (commonSale.idVat = (_b = sale.idVat) !== null && _b !== void 0 ? _b : 17);
                // sale or return
                if (sale.type === custom_type_1.CustomProtocol.ItemType.HOLD) {
                    // item
                    printerFiscalReceipt.ele('printRecItem', commonSale);
                    // item adjustment
                    if (sale.operations && sale.operations.length > 0) {
                        for (const operation of sale.operations) {
                            const recItemAdjustment = {
                                description: (_c = operation.description) !== null && _c !== void 0 ? _c : '',
                                department: (_d = operation.department) !== null && _d !== void 0 ? _d : 1,
                                amount: operation.amount,
                                // only values 2 or 3 are allowed
                                adjustmentType: [2, 3].includes(operation.adjustmentType) ? operation.adjustmentType : 3,
                            };
                            operation.idVat !== void 0 && (recItemAdjustment.idVat = (_e = operation.idVat) !== null && _e !== void 0 ? _e : 17);
                            printerFiscalReceipt.ele('printRecItemAdjustment', recItemAdjustment);
                        }
                    }
                }
                else if (sale.type === custom_type_1.CustomProtocol.ItemType.CANCEL) {
                    // void item
                    printerFiscalReceipt.ele('printRecItemVoid', commonSale);
                    // void item adjustment
                    // if (sale.operations && sale.operations.length > 0) {
                    //     for (const operation of sale.operations) {
                    //         printerFiscalReceipt.ele('printRecItemAdjustmentVoid');
                    //     }
                    // }
                }
            }
        }
        // refunds
        if (receipt.refunds && receipt.refunds.length > 0) {
            for (const refund of receipt.refunds) {
                if (refund.type === custom_type_1.CustomProtocol.ItemType.HOLD) {
                    const recRefund = {
                        description: refund.description || '',
                        quantity: (_f = refund.quantity) !== null && _f !== void 0 ? _f : 1,
                        unitPrice: (_g = refund.unitPrice) !== null && _g !== void 0 ? _g : 0,
                        department: (_h = refund.department) !== null && _h !== void 0 ? _h : 1,
                    };
                    refund.idVat !== void 0 && (recRefund.idVat = (_j = refund.idVat) !== null && _j !== void 0 ? _j : 17);
                    printerFiscalReceipt.ele('printRecRefund', recRefund);
                }
                else if (refund.type === custom_type_1.CustomProtocol.ItemType.CANCEL) {
                    printerFiscalReceipt.ele('printRecRefundVoid');
                }
            }
        }
        // personalTaxCode
        if (receipt.personalTaxCode) {
            const { message = '', messageType = '3', font = 'B' } = receipt.personalTaxCode;
            printerFiscalReceipt.ele('printRecMessage', {
                message,
                messageType,
                font
            });
        }
        // subtotals
        if (receipt.subtotals && receipt.subtotals.length > 0) {
            for (const subtotal of receipt.subtotals) {
                if (subtotal.type === custom_type_1.CustomProtocol.ItemType.HOLD) {
                    if (subtotal.operations && subtotal.operations.length > 0) {
                        for (const operation of subtotal.operations) {
                            const recSubtotalAdjustment = {
                                description: operation.description || '',
                                amount: operation.amount,
                                adjustmentType: [2, 3].includes(operation.adjustmentType) ? operation.adjustmentType : 3
                            };
                            operation.idVat !== void 0 && (recSubtotalAdjustment.idVat = (_k = operation.idVat) !== null && _k !== void 0 ? _k : 17);
                            printerFiscalReceipt.ele('printRecSubtotalAdjustment', recSubtotalAdjustment);
                        }
                    }
                    printerFiscalReceipt.ele('printRecSubtotal');
                }
                else if (subtotal.type === custom_type_1.CustomProtocol.ItemType.CANCEL) {
                    if (subtotal.operations && subtotal.operations.length > 0) {
                        for (const operation of subtotal.operations) {
                            printerFiscalReceipt.ele('printRecSubtotalAdjustVoid');
                        }
                    }
                }
            }
        }
        // payments
        if (receipt.payments && receipt.payments.length > 0) {
            for (const payment of receipt.payments) {
                printerFiscalReceipt.ele('printRecTotal', {
                    description: (_l = payment.description) !== null && _l !== void 0 ? _l : '',
                    payment: (_m = payment.payment) !== null && _m !== void 0 ? _m : 0,
                    paymentType: (_o = payment.paymentType) !== null && _o !== void 0 ? _o : 0,
                });
            }
        }
        // personalTaxCode
        // if (receipt.personalTaxCode) {
        //     const { message = '', messageType = '3', font = 'B' } = receipt.personalTaxCode;
        //     printerFiscalReceipt.ele('printRecMessage', {
        //         message,
        //         messageType,
        //         font
        //     });
        // }
        // barCode
        if (receipt.barCode) {
            printerFiscalReceipt.ele('printBarCode', {
                operator: (_p = receipt.barCode.operator) !== null && _p !== void 0 ? _p : 1,
                position: (_q = receipt.barCode.position) !== null && _q !== void 0 ? _q : 900,
                width: (_r = receipt.barCode.width) !== null && _r !== void 0 ? _r : 1,
                height: (_s = receipt.barCode.height) !== null && _s !== void 0 ? _s : 1,
                hRIPosition: (_t = receipt.barCode.hriPosition) !== null && _t !== void 0 ? _t : 0,
                hRIFont: (_u = receipt.barCode.hriFont) !== null && _u !== void 0 ? _u : 'A',
                codeType: (_v = receipt.barCode.type) !== null && _v !== void 0 ? _v : 'CODE128',
                code: (_w = receipt.barCode.data) !== null && _w !== void 0 ? _w : ''
            });
        }
        // qrCode
        if (receipt.qrCode) {
            printerFiscalReceipt.ele('printBarCode', {
                operator: (_x = receipt.qrCode.operator) !== null && _x !== void 0 ? _x : 1,
                qRCodeAlignment: (_y = receipt.qrCode.alignment) !== null && _y !== void 0 ? _y : 0,
                qRCodeSize: (_z = receipt.qrCode.size) !== null && _z !== void 0 ? _z : 1,
                qRCodeErrorCorrection: (_0 = receipt.qrCode.errorCorrection) !== null && _0 !== void 0 ? _0 : 0,
                codeType: (_1 = receipt.qrCode.type) !== null && _1 !== void 0 ? _1 : 'CODE128',
                code: (_2 = receipt.qrCode.data) !== null && _2 !== void 0 ? _2 : ''
            });
        }
        // graphicCoupon
        if (receipt.graphicCoupon) {
            printerFiscalReceipt.ele('printGraphicCoupon', {
                operator: (_3 = receipt.graphicCoupon.operator) !== null && _3 !== void 0 ? _3 : 1,
                graphicFormat: (_4 = receipt.graphicCoupon.format) !== null && _4 !== void 0 ? _4 : 'B'
            }, (_5 = receipt.graphicCoupon.value) !== null && _5 !== void 0 ? _5 : '');
        }
        if (receipt.endDisplayText) {
            printerFiscalReceipt.ele('displayText', {
                data: receipt.endDisplayText.data || ''
            });
        }
        // end
        printerFiscalReceipt.ele('endFiscalReceiptCut');
        return printerFiscalReceipt;
    }
    /**
     * convert `Fiscal.Report` to the object that printer server supports.
     * @param report
     * @returns
     */
    convertReportToXmlDoc(report) {
        var _a, _b, _c, _d, _e;
        const printerFiscalReport = xmlbuilder.create('printerFiscalReport', CustomXmlHttpClient.XML_HEADER);
        if (report.type === custom_type_1.CustomProtocol.ReportType.DAILY_FINANCIAL_REPORT) {
            printerFiscalReport.ele('printXReport', {
                operator: (_a = report.operator) !== null && _a !== void 0 ? _a : 1
            });
        }
        else if (report.type === custom_type_1.CustomProtocol.ReportType.DAILY_FISCAL_CLOUSE) {
            printerFiscalReport.ele('printZReport', {
                operator: (_b = report.operator) !== null && _b !== void 0 ? _b : 1,
                timeout: (_c = report.timeout) !== null && _c !== void 0 ? _c : 6000
            });
        }
        else if (report.type === custom_type_1.CustomProtocol.ReportType.ALL) {
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
        var _a, _b, _c;
        const printerFiscalReceipt = xmlbuilder.create('printerFiscalReceipt', CustomXmlHttpClient.XML_HEADER);
        const commonLabel = {
            docRefZ: cancel.docRefZ || '',
            docRefNumber: cancel.docRefNumber || '',
            docDate: cancel.docDate || '',
            checkOnly: (_a = cancel.checkOnly) !== null && _a !== void 0 ? _a : custom_type_1.CustomProtocol.EnableType.ABLE,
        };
        cancel.printPreview && (commonLabel.printPreview = cancel.printPreview);
        cancel.fiscalSerial && (commonLabel.fiscalSerial = cancel.fiscalSerial);
        cancel.codLottery && (commonLabel.codLottery = cancel.codLottery);
        // Return feasibility check
        if (cancel.checkOnly === custom_type_1.CustomProtocol.EnableType.ABLE) {
            printerFiscalReceipt.ele('beginRtDocAnnulment', commonLabel);
        }
        else {
            // Execution of return document
            printerFiscalReceipt.ele('beginRtDocAnnulment', commonLabel);
            if (Array.isArray(cancel.cancelRecItems) && cancel.cancelRecItems.length) {
                for (let recItem of cancel.cancelRecItems) {
                    printerFiscalReceipt.ele('printRecItem', {
                        description: recItem.description || '',
                        quantity: recItem.quantity || 1,
                        unitPrice: (_b = recItem.unitPrice) !== null && _b !== void 0 ? _b : 0,
                        department: (_c = recItem.department) !== null && _c !== void 0 ? _c : 1,
                    });
                }
            }
        }
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
        const printerCommand = xmlbuilder.create(commands.length > 1 ? 'printerCommands' : 'printerCommand', CustomXmlHttpClient.XML_HEADER);
        for (const command of commands) {
            if (CustomXmlHttpClient.COMMAND_CODE[command.code]) {
                CustomXmlHttpClient.COMMAND_CODE[command.code](printerCommand, command);
            }
        }
        return printerCommand;
    }
}
CustomXmlHttpClient.XML_RESPONSE = 'response';
CustomXmlHttpClient.INFO_XML_RESPONSE = 'infoResp';
CustomXmlHttpClient.XML_HEADER = {
    version: '1.0',
    encoding: 'utf8',
    standalone: true,
};
CustomXmlHttpClient.COMMAND_CODE = {
    [custom_type_1.CustomProtocol.CommandCode.OPEN_DRAWER]: (printerCommand, command) => {
        printerCommand.ele('openDrawer');
    },
    [custom_type_1.CustomProtocol.CommandCode.QUERY_PRINTER_STATUS]: (printerCommand, command) => {
        printerCommand.ele('queryPrinterStatus');
    },
    [custom_type_1.CustomProtocol.CommandCode.RESET_PRINTER]: (printerCommand, command) => {
        var _a, _b;
        printerCommand.ele('resetPrinter', {
            operator: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.operator) !== null && _b !== void 0 ? _b : 1
        });
    },
    [custom_type_1.CustomProtocol.CommandCode.GET_NATIVE_CODE_FUNCTION]: (printerCommand, command) => {
        var _a, _b, _c, _d;
        printerCommand.ele('directIO', {
            command: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : '0000',
            data: (_d = (_c = command.data) === null || _c === void 0 ? void 0 : _c.operator) !== null && _d !== void 0 ? _d : '01',
        });
    },
    [custom_type_1.CustomProtocol.CommandCode.GET_INFO]: (printerCommand, command) => {
        printerCommand.ele('getInfo');
    },
    [custom_type_1.CustomProtocol.CommandCode.DISPLAY_TEXT]: (printerCommand, command) => {
        var _a, _b;
        printerCommand.ele('displayText', {
            data: (_b = (_a = command.data) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '',
        });
    }
};
exports.CustomXmlHttpClient = CustomXmlHttpClient;
//# sourceMappingURL=xml-custom-http.js.map