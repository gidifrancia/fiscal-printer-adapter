"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const default_server_fixture_1 = require("../fixtures/default-server.fixture");
const xml2js_1 = require("xml2js");
const assert_1 = tslib_1.__importDefault(require("assert"));
const express_1 = require("express");
const xml_custom_http_1 = require("../../lib/printer/custom/xml-custom-http");
const custom_type_1 = require("../../lib/constants/custom/custom.type");
mocha_1.describe('custom-cgi', () => {
    let server;
    let client;
    before(() => {
        const app = default_server_fixture_1.DefaultServer.create();
        app.use(express_1.text({ type: '*/*' }));
        app.post('/xml/printer.htm', async (req, res) => {
            req.accepts('text/plain');
            req.acceptsCharsets('utf-8');
            const xmlStr = req.body;
            const parser = new xml2js_1.Parser({ explicitArray: false, mergeAttrs: true });
            const xmlObj = await parser.parseStringPromise(xmlStr);
            if (xmlObj && Object.keys(xmlObj).length) {
                if (xmlObj['printerFiscalReceipt']) {
                    res.type('text/xml').status(200).send(`
                        <?xml version="1.0" encoding="utf-8"?>
                            <response success="true" status="0">
                                <addInfo>
                                    <elementList>lastCommand, dateTime, printerStatus, fpStatus, receiptStep, nClose, fiscalDoc</elementList>
                                    <lastCommand>74</lastCommand>
                                    <dateTime>2022-04-20T18:06:21</dateTime>
                                    <printerStatus>20110</printerStatus>
                                    <fpStatus>000</fpStatus>
                                    <receiptStep>0</receiptStep>
                                    <nClose>0972</nClose>
                                    <fiscalDoc>0003</fiscalDoc>
                                </addInfo>
                            </response>
                        `);
                }
                else if (xmlObj['printerFiscalReport']) {
                    res.type('text/xml').status(200).send(`<?xml version="1.0" encoding="utf-8"?>
                            <response success="true" status="0">
                                <addInfo>
                                    <elementList>lastCommand,printerStatus,zRepNumber,dailyAmount</elementList>
                                    <lastCommand>74</lastCommand>
                                    <printerStatus>20110</printerStatus>
                                    <zRepNumber>764</zRepNumber>
                                    <dailyAmount>176,40</dailyAmount>
                                </addInfo>
                            </response>
                        `);
                }
                else if (xmlObj['printerCommand']) {
                    res.type('text/xml').status(200).send(`
                            <?xml version="1.0" encoding="utf-8"?>
                                <response success="true" status="0">
                                    <addInfo>
                                        <elementList>lastCommand,printerStatus</elementList>
                                        <lastCommand>74</lastCommand>
                                        <cpuRel>07.00</cpuRel>
                                        <mfRel>04.3</mfRel>
                                        <mfStatus>0</mfStatus>
                                        <fpStatus>00110</fpStatus>
                                    </addInfo>
                                </response>
                        `);
                }
                else {
                    res.status(400).send('unknown body type');
                }
            }
            else {
                res.status(400).send('unknown body format');
            }
        });
        server = app.listen(80);
        client = new xml_custom_http_1.CustomXmlHttpClient({
            host: '192.168.1.97',
            fiscalId: 'STMTE500271'
        });
    });
    it('Fiscal Receipt', async () => {
        const response = await client.printFiscalReceipt({
            sales: [
                {
                    type: custom_type_1.CustomProtocol.ItemType.HOLD,
                    description: 'A',
                    quantity: 1,
                    unitPrice: 5
                },
                {
                    type: custom_type_1.CustomProtocol.ItemType.HOLD,
                    description: 'B',
                    quantity: 2,
                    unitPrice: 2
                },
                {
                    type: custom_type_1.CustomProtocol.ItemType.HOLD,
                    description: 'C',
                    quantity: 3,
                    unitPrice: 3
                },
            ],
            subtotals: [{
                    type: custom_type_1.CustomProtocol.ItemType.HOLD
                }],
            payments: [
                {
                    description: 'Payment in cash',
                    payment: 18,
                    paymentType: 1
                }
            ],
            personalTaxCode: {
                message: 'RSSMRA00A01G337P',
                messageType: '3',
                font: 'B',
            }
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    it('Cancel feasibility check', async () => {
        const response = await client.printCancel({
            docRefZ: '',
            docRefNumber: '',
            docDate: '',
            printPreview: custom_type_1.CustomProtocol.EnableType.DISABLE,
            fiscalSerial: 'STMTE500271',
            checkOnly: custom_type_1.CustomProtocol.EnableType.ABLE,
            codLottery: '',
        });
        console.log(response, 'Cancel feasibility check');
        assert_1.default.ok(response.ok);
    });
    it('Execution of Cancel document', async () => {
        const response = await client.printCancel({
            docRefZ: '',
            docRefNumber: '',
            docDate: '',
            printPreview: custom_type_1.CustomProtocol.EnableType.DISABLE,
            fiscalSerial: 'STMTE500271',
            checkOnly: custom_type_1.CustomProtocol.EnableType.DISABLE,
            codLottery: '',
            cancelRecItems: [{
                    description: 'cancel dish1',
                    quantity: 3,
                    unitPrice: 3,
                    department: 1
                }]
        });
        console.log(response, 'Execution of Cancel document');
        assert_1.default.ok(response.ok);
    });
    it('Fiscal Report', async () => {
        const response = await client.printFiscalReport({
            type: custom_type_1.CustomProtocol.ReportType.DAILY_FISCAL_CLOUSE,
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    it('Command', async () => {
        const response = await client.executeCommand({
            code: custom_type_1.CustomProtocol.CommandCode.OPEN_DRAWER
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    after(() => {
        server.close();
    });
});
//# sourceMappingURL=custom-cgi.acceptance.js.map