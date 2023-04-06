"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fiscal = void 0;
var Fiscal;
(function (Fiscal) {
    // *********************
    // Common type
    // *********************
    // *********************
    // Enum
    // *********************
    let ItemType;
    (function (ItemType) {
        ItemType[ItemType["HOLD"] = 0] = "HOLD";
        ItemType[ItemType["CANCEL"] = 1] = "CANCEL";
    })(ItemType = Fiscal.ItemType || (Fiscal.ItemType = {}));
    let ReportType;
    (function (ReportType) {
        ReportType[ReportType["DAILY_FINANCIAL_REPORT"] = 0] = "DAILY_FINANCIAL_REPORT";
        ReportType[ReportType["DAILY_FISCAL_CLOUSE"] = 1] = "DAILY_FISCAL_CLOUSE";
        ReportType[ReportType["ALL"] = 2] = "ALL";
    })(ReportType = Fiscal.ReportType || (Fiscal.ReportType = {}));
    let CancelType;
    (function (CancelType) {
        CancelType["REFUND"] = "REFUND";
        CancelType["VOID"] = "VOID";
    })(CancelType = Fiscal.CancelType || (Fiscal.CancelType = {}));
    let MessageType;
    (function (MessageType) {
        MessageType[MessageType["ADDITIONAL_HEADER"] = 1] = "ADDITIONAL_HEADER";
        MessageType[MessageType["TRAILER"] = 2] = "TRAILER";
        MessageType[MessageType["ADDITIONAL_TRAILER"] = 3] = "ADDITIONAL_TRAILER";
        MessageType[MessageType["ADDITIONAL_DESC"] = 4] = "ADDITIONAL_DESC";
        MessageType[MessageType["CUSTOMER_ID"] = 7] = "CUSTOMER_ID";
        MessageType[MessageType["PRINT_OR_ERASE_EFTPOS_TRANS_LINE"] = 8] = "PRINT_OR_ERASE_EFTPOS_TRANS_LINE";
    })(MessageType = Fiscal.MessageType || (Fiscal.MessageType = {}));
    let OperationType;
    (function (OperationType) {
        OperationType[OperationType["DISCOUNT_SALE"] = 0] = "DISCOUNT_SALE";
        OperationType[OperationType["DISCOUNT_DEPARTMENT"] = 1] = "DISCOUNT_DEPARTMENT";
        OperationType[OperationType["DISCOUNT_SUBTOTAL_PRINT"] = 2] = "DISCOUNT_SUBTOTAL_PRINT";
        OperationType[OperationType["DISCOUNT_SUBTOTAL_NOT_PRINT"] = 3] = "DISCOUNT_SUBTOTAL_NOT_PRINT";
        OperationType[OperationType["SURCHARGE_SALE"] = 4] = "SURCHARGE_SALE";
        OperationType[OperationType["SURCHARGE_DEPARTMENT"] = 5] = "SURCHARGE_DEPARTMENT";
        OperationType[OperationType["SURCHARGE_SUBTOTAL_PRINT"] = 6] = "SURCHARGE_SUBTOTAL_PRINT";
        OperationType[OperationType["SURCHARGE_SUBTOTAL_NOT_PRINT"] = 7] = "SURCHARGE_SUBTOTAL_NOT_PRINT";
        OperationType[OperationType["DEPOSIT"] = 8] = "DEPOSIT";
        OperationType[OperationType["FREE_OF_CHARGE"] = 9] = "FREE_OF_CHARGE";
        OperationType[OperationType["SINGLE_USE_VOUCHER"] = 10] = "SINGLE_USE_VOUCHER";
    })(OperationType = Fiscal.OperationType || (Fiscal.OperationType = {}));
    let SubtotalOpt;
    (function (SubtotalOpt) {
        SubtotalOpt[SubtotalOpt["PRINT_DISPLAY"] = 0] = "PRINT_DISPLAY";
        SubtotalOpt[SubtotalOpt["PRINT"] = 1] = "PRINT";
        SubtotalOpt[SubtotalOpt["DISPLAY"] = 2] = "DISPLAY";
    })(SubtotalOpt = Fiscal.SubtotalOpt || (Fiscal.SubtotalOpt = {}));
    let PaymentType;
    (function (PaymentType) {
        PaymentType[PaymentType["CASH"] = 0] = "CASH";
        PaymentType[PaymentType["CHEQUE"] = 1] = "CHEQUE";
        PaymentType[PaymentType["CREDIT_OR_CREDIT_CARD"] = 2] = "CREDIT_OR_CREDIT_CARD";
        PaymentType[PaymentType["TICKET"] = 3] = "TICKET";
        PaymentType[PaymentType["MULTI_TICKET"] = 4] = "MULTI_TICKET";
        PaymentType[PaymentType["NOT_PAID"] = 5] = "NOT_PAID";
        PaymentType[PaymentType["PAYMENT_DISCOUNT"] = 6] = "PAYMENT_DISCOUNT";
    })(PaymentType = Fiscal.PaymentType || (Fiscal.PaymentType = {}));
    let CommandCode;
    (function (CommandCode) {
        CommandCode[CommandCode["OPEN_DRAWER"] = 0] = "OPEN_DRAWER";
        // AUTHORIZESALES,
        // BEGIN_TRAINING,
        // EFTPOS_DAILY_CLOSURE,
        // EFTPOS_GET_CURRENT_TOTAL,
        // END_TRAINING,
        // GET_DATE,
        // PRINT_CONTENT_BY_DATE,
        // PRINT_CONTENT_BY_NUMBERS,
        // PRINT_DUPLICATE_RECEIPT,
        // PRINT_REC_CASH,
        // PRINT_REC_VOID,
        // QUERY_CONTENT_BY_DATE,
        // QUERY_CONTENT_BY_NUMBERS,
        CommandCode[CommandCode["QUERY_PRINTER_STATUS"] = 1] = "QUERY_PRINTER_STATUS";
        CommandCode[CommandCode["REBOOT_WEB_SERVER"] = 2] = "REBOOT_WEB_SERVER";
        CommandCode[CommandCode["RESET_PRINTER"] = 3] = "RESET_PRINTER";
        // SET_DATE,
        // SET_LOGO,
        CommandCode[CommandCode["GET_NATIVE_CODE_FUNCTION"] = 4] = "GET_NATIVE_CODE_FUNCTION";
        CommandCode[CommandCode["DISPLAY_TEXT"] = 5] = "DISPLAY_TEXT";
        CommandCode[CommandCode["PRINT_CONTENT_BY_NUMBERS"] = 6] = "PRINT_CONTENT_BY_NUMBERS";
    })(CommandCode = Fiscal.CommandCode || (Fiscal.CommandCode = {}));
    // indicates the type of data to collect:
    let DataType;
    (function (DataType) {
        DataType[DataType["ALL"] = 0] = "ALL";
        DataType[DataType["COMMERCIAL_DOCS"] = 1] = "COMMERCIAL_DOCS";
        DataType[DataType["INVOICES"] = 2] = "INVOICES";
        DataType[DataType["BOX_OFFICE_TICKETS"] = 3] = "BOX_OFFICE_TICKETS";
        DataType[DataType["OBSOLETE"] = 4] = "OBSOLETE";
    })(DataType = Fiscal.DataType || (Fiscal.DataType = {}));
})(Fiscal = exports.Fiscal || (exports.Fiscal = {}));
//# sourceMappingURL=fiscal.type.js.map