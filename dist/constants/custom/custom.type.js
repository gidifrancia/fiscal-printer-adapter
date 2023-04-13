"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomProtocol = void 0;
var CustomProtocol;
(function (CustomProtocol) {
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
    })(ItemType = CustomProtocol.ItemType || (CustomProtocol.ItemType = {}));
    let EnableType;
    (function (EnableType) {
        EnableType[EnableType["DISABLE"] = 0] = "DISABLE";
        EnableType[EnableType["ABLE"] = 1] = "ABLE";
    })(EnableType = CustomProtocol.EnableType || (CustomProtocol.EnableType = {}));
    let ReportType;
    (function (ReportType) {
        ReportType[ReportType["DAILY_FINANCIAL_REPORT"] = 0] = "DAILY_FINANCIAL_REPORT";
        ReportType[ReportType["DAILY_FISCAL_CLOUSE"] = 1] = "DAILY_FISCAL_CLOUSE";
        ReportType[ReportType["ALL"] = 2] = "ALL";
    })(ReportType = CustomProtocol.ReportType || (CustomProtocol.ReportType = {}));
    let CancelType;
    (function (CancelType) {
        CancelType["REFUND"] = "REFUND";
        CancelType["VOID"] = "VOID";
    })(CancelType = CustomProtocol.CancelType || (CustomProtocol.CancelType = {}));
    let AdjustmentType;
    (function (AdjustmentType) {
        AdjustmentType[AdjustmentType["SURCHARGE_DEPARTMENT"] = 2] = "SURCHARGE_DEPARTMENT";
        AdjustmentType[AdjustmentType["DISCOUNT_DEPARTMENT"] = 3] = "DISCOUNT_DEPARTMENT";
    })(AdjustmentType = CustomProtocol.AdjustmentType || (CustomProtocol.AdjustmentType = {}));
    let SubtotalOpt;
    (function (SubtotalOpt) {
        SubtotalOpt[SubtotalOpt["PRINT_DISPLAY"] = 0] = "PRINT_DISPLAY";
        SubtotalOpt[SubtotalOpt["PRINT"] = 1] = "PRINT";
        SubtotalOpt[SubtotalOpt["DISPLAY"] = 2] = "DISPLAY";
    })(SubtotalOpt = CustomProtocol.SubtotalOpt || (CustomProtocol.SubtotalOpt = {}));
    let PaymentType;
    (function (PaymentType) {
        PaymentType[PaymentType["CASH"] = 0] = "CASH";
        PaymentType[PaymentType["CHEQUE"] = 1] = "CHEQUE";
        PaymentType[PaymentType["CREDIT_OR_CREDIT_CARD"] = 2] = "CREDIT_OR_CREDIT_CARD";
        PaymentType[PaymentType["TICKET"] = 3] = "TICKET";
        PaymentType[PaymentType["MULTI_TICKET"] = 4] = "MULTI_TICKET";
        PaymentType[PaymentType["NOT_PAID"] = 5] = "NOT_PAID";
        PaymentType[PaymentType["PAYMENT_DISCOUNT"] = 6] = "PAYMENT_DISCOUNT";
    })(PaymentType = CustomProtocol.PaymentType || (CustomProtocol.PaymentType = {}));
    let CommandCode;
    (function (CommandCode) {
        CommandCode[CommandCode["OPEN_DRAWER"] = 0] = "OPEN_DRAWER";
        CommandCode[CommandCode["QUERY_PRINTER_STATUS"] = 1] = "QUERY_PRINTER_STATUS";
        CommandCode[CommandCode["RESET_PRINTER"] = 2] = "RESET_PRINTER";
        CommandCode[CommandCode["GET_NATIVE_CODE_FUNCTION"] = 3] = "GET_NATIVE_CODE_FUNCTION";
        CommandCode[CommandCode["GET_INFO"] = 4] = "GET_INFO";
        CommandCode[CommandCode["DISPLAY_TEXT"] = 5] = "DISPLAY_TEXT";
    })(CommandCode = CustomProtocol.CommandCode || (CustomProtocol.CommandCode = {}));
})(CustomProtocol = exports.CustomProtocol || (exports.CustomProtocol = {}));
//# sourceMappingURL=custom.type.js.map