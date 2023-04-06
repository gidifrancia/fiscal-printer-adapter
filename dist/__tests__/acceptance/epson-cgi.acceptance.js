"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const default_server_fixture_1 = require("../fixtures/default-server.fixture");
const xml2js_1 = require("xml2js");
const assert_1 = tslib_1.__importDefault(require("assert"));
const xml_http_1 = require("../../lib/printer/epson/xml-http");
const fiscal_type_1 = require("../../lib/constants/fiscal.type");
const express_1 = require("express");
mocha_1.describe('epson-cgi', () => {
    let server;
    let client;
    before(() => {
        const app = default_server_fixture_1.DefaultServer.create();
        app.use(express_1.text({ type: '*/*' }));
        app.post('/cgi-bin/fpmate.cgi', async (req, res) => {
            req.accepts('text/xml');
            req.acceptsCharsets('utf-8');
            const xmlStr = req.body;
            const parser = new xml2js_1.Parser({ explicitArray: false, mergeAttrs: true });
            const xmlObj = await parser.parseStringPromise(xmlStr);
            if (xmlObj['s:Envelope'] && xmlObj['s:Envelope']['s:Body']) {
                if (xmlObj['s:Envelope']['s:Body']['printerFiscalReceipt']) {
                    res.type('text/xml').status(200).send(`<?xml version="1.0" encoding="utf-8"?>
                        <soapenv:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                            <soapenv:Body>
                                <response success="true" code="" status="2">
                                    <addInfo>
                                        <elementList>lastCommand,printerStatus,fiscalReceiptNumber,fiscalReceiptAmount,fiscalReceiptDate,fiscalReceiptTime,zRepNumber</elementList>
                                        <lastCommand>74</lastCommand>
                                        <printerStatus>20110</printerStatus>
                                        <fiscalReceiptNumber>1</fiscalReceiptNumber>
                                        <fiscalReceiptAmount>1,00</fiscalReceiptAmount>
                                        <fiscalReceiptDate>01/01/2022</fiscalReceiptDate>
                                        <fiscalReceiptTime>12:00</fiscalReceiptTime>
                                        <zRepNumber>764</zRepNumber>
                                    </addInfo>
                                </response>
                            </soapenv:Body>
                        </soapenv:Envelope>`);
                }
                else if (xmlObj['s:Envelope']['s:Body']['printerFiscalReport']) {
                    res.type('text/xml').status(200).send(`<?xml version="1.0" encoding="utf-8"?>
                        <soapenv:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                          <soapenv:Body>
                                <response success="true" code="" status="2">
                                    <addInfo>
                                        <elementList>lastCommand,printerStatus,zRepNumber,dailyAmount</elementList>
                                        <lastCommand>74</lastCommand>
                                        <printerStatus>20110</printerStatus>
                                        <zRepNumber>764</zRepNumber>
                                        <dailyAmount>176,40</dailyAmount>
                                    </addInfo>
                              </response>
                            </soapenv:Body>
                        </soapenv:Envelope>`);
                }
                else if (xmlObj['s:Envelope']['s:Body']['printerCommand'] || xmlObj['s:Envelope']['s:Body']['printerCommands']) {
                    res.type('text/xml').status(200).send(`<?xml version="1.0" encoding="utf-8"?>
                        <soapenv:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                          <soapenv:Body>
                                <response success="true" code="" status="x">
                                    <addInfo>
                                        <elementList>lastCommand,printerStatus</elementList>
                                        <lastCommand>74</lastCommand>
                                        <cpuRel>07.00</cpuRel>
                                        <mfRel>04.3</mfRel>
                                        <mfStatus>0</mfStatus>
                                        <fpStatus>00110</fpStatus>
                                    </addInfo>
                                </response>
                            </soapenv:Body>
                        </soapenv:Envelope>`);
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
        client = new xml_http_1.EpsonXmlHttpClient({
            host: '192.168.111.99',
            deviceId: 'local_printer',
            timeout: 10000
        });
    });
    it('Fiscal Receipt', async () => {
        const response = await client.printFiscalReceipt({
            sales: [
                {
                    type: fiscal_type_1.Fiscal.ItemType.HOLD,
                    description: 'A',
                    quantity: 1,
                    unitPrice: 5
                },
                {
                    type: fiscal_type_1.Fiscal.ItemType.HOLD,
                    description: 'B',
                    quantity: 2,
                    unitPrice: 2.5
                },
                {
                    type: fiscal_type_1.Fiscal.ItemType.HOLD,
                    description: 'C',
                    quantity: 3,
                    unitPrice: 3
                },
            ],
            subtotals: [
                {
                    type: fiscal_type_1.Fiscal.ItemType.HOLD
                }
            ],
            payments: [
                {
                    description: 'Payment in cash',
                    payment: 19
                }
            ],
            personalTaxCode: {
                message: 'RSSMRA00A01G337P',
                messageType: fiscal_type_1.Fiscal.MessageType.CUSTOMER_ID,
                index: 1
            }
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    it('Cancel Fiscal Report', async () => {
        const response = await client.printCancel({
            type: fiscal_type_1.Fiscal.CancelType.VOID,
            zRepNum: '0134',
            docNum: '0001',
            date: '01012022',
            fiscalNum: '11111111111'
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    it('Fiscal Report', async () => {
        const response = await client.printFiscalReport({
            type: fiscal_type_1.Fiscal.ReportType.DAILY_FISCAL_CLOUSE,
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    it('Command', async () => {
        const response = await client.executeCommand({
            code: fiscal_type_1.Fiscal.CommandCode.OPEN_DRAWER
        });
        console.log(response);
        assert_1.default.ok(response.ok);
    });
    after(() => {
        server.close();
    });
});
//# sourceMappingURL=epson-cgi.acceptance.js.map