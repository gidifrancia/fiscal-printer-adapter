import { AnyObj } from "./common.type";
export declare namespace Fiscal {
    type OpenDrawer = {
        operator?: string;
    };
    type ReceiptRow = {
        sale?: Sale;
        barcode?: BarCode;
        qrCode?: QrCode;
        graphicCoupon?: GraphicCoupon;
        message?: Message;
        lottery?: Lottery;
        refund?: Refund;
        subtotal?: Subtotal;
        payment?: Payment;
    };
    type Receipt = {
        operator?: string;
        rows?: ReceiptRow[];
        openDrawer?: OpenDrawer;
    };
    type Report = {
        type: ReportType;
        operator?: string;
        timeout?: number;
        openDrawer?: OpenDrawer;
    };
    type Cancel = {
        type: CancelType;
        zRepNum: string;
        docNum: string;
        date: string;
        fiscalNum: string;
        operator?: string;
    };
    type Command = {
        code: CommandCode;
        data?: AnyObj;
    };
    type Sale = {
        type: ItemType;
        operations?: Operation[];
        operator?: string;
        description?: string;
        quantity: number;
        unitPrice: number;
        department?: string;
        justification?: string;
    };
    type Lottery = {
        code: string;
        operator?: string;
    };
    type Message = {
        /**
         * represents the text to be printed or the customer ID. The maximum lengths are as follows:
         *
         * Message type 4 = Max 38 (or 37 with invoices)
         * Message type 7 = Max 46 (although native protocol limit is 64)
         * Message type 8 = Not applicable. Attribute can be omitted
         * All other message types = Max 46
         */
        message: string;
        /**
         * defines the row type to be printed:
         * 1 = Additional header. This type must be placed before the beginFiscalReceipt sub-element
         * 2 = Trailer (after NUMERO CONFEZIONI and before NUMERO CASSA)
         * 3 = Additional trailer (promo lines after NUMERO CASSA and before barcode or QR code)
         * 4 = Additional description (in the body of the commercial document or direct invoice)
         * 7 = Customer Id. Sets CustomerId field in www/json_files/rec.json file(The font has no relevance so the attribute can be omitted)
         * 8 = Print or erase all EFT-POS transaction lines
         */
        messageType: MessageType;
        /**
         * indicates the line number:
         *
         * Range 1 to 9 for additional header (type 1)
         * Range 1 to 99 for trailer and additional trailer descriptions (types 2 and 3)
         * No meaning for additional row, Customer Id and EFT-POS transaction lines (types 4, 7 and 8)
         * The attribute can be omitted
         */
        index?: number;
        font?: number;
        /**
         * attribute is only relevant when messageType is 8:
         *
         * 0 = Print EFT-POS transaction lines
         * 1 = Cancel EFT-POS transaction lines
         */
        clearEFTPOSBuffer?: number;
        operator?: string;
    };
    type Refund = {
        type: ItemType;
        optType?: string;
        operation?: Operation;
        operator?: string;
        quantity?: number;
        unitPrice?: number;
        amount?: number;
        description?: string;
        department?: string;
        justification?: string;
    };
    type Subtotal = {
        type: ItemType;
        option?: SubtotalOpt;
        operations?: Operation[];
        operator?: string;
    };
    type Payment = {
        paymentType?: PaymentType;
        index?: string;
        operator?: string;
        description?: string;
        payment?: number;
        justification?: string;
    };
    type Operation = {
        type: OperationType;
        operator?: string;
        amount: number;
        description?: string;
        department?: string;
        justification?: string;
    };
    type GraphicCoupon = {
        format?: string;
        value?: string;
        operator?: string;
    };
    type PersonTaxCode = {
        code?: string;
        operator?: string;
    };
    type BarCode = {
        position?: string;
        width?: number;
        height?: number;
        hriPosition?: string;
        hriFont?: string;
        type?: string;
        data: string;
        operator?: string;
    };
    type QrCode = {
        alignment?: string;
        size?: number;
        errorCorrection?: number;
        type?: string;
        data: string;
        operator?: string;
    };
    enum ItemType {
        HOLD = 0,
        CANCEL = 1
    }
    enum ReportType {
        DAILY_FINANCIAL_REPORT = 0,
        DAILY_FISCAL_CLOUSE = 1,
        ALL = 2
    }
    enum CancelType {
        REFUND = "REFUND",
        VOID = "VOID"
    }
    enum MessageType {
        ADDITIONAL_HEADER = 1,
        TRAILER = 2,
        ADDITIONAL_TRAILER = 3,
        ADDITIONAL_DESC = 4,
        CUSTOMER_ID = 7,
        PRINT_OR_ERASE_EFTPOS_TRANS_LINE = 8
    }
    enum OperationType {
        DISCOUNT_SALE = 0,
        DISCOUNT_DEPARTMENT = 1,
        DISCOUNT_SUBTOTAL_PRINT = 2,
        DISCOUNT_SUBTOTAL_NOT_PRINT = 3,
        SURCHARGE_SALE = 4,
        SURCHARGE_DEPARTMENT = 5,
        SURCHARGE_SUBTOTAL_PRINT = 6,
        SURCHARGE_SUBTOTAL_NOT_PRINT = 7,
        DEPOSIT = 8,
        FREE_OF_CHARGE = 9,
        SINGLE_USE_VOUCHER = 10
    }
    enum SubtotalOpt {
        PRINT_DISPLAY = 0,
        PRINT = 1,
        DISPLAY = 2
    }
    enum PaymentType {
        CASH = 0,
        CHEQUE = 1,
        CREDIT_OR_CREDIT_CARD = 2,
        TICKET = 3,
        MULTI_TICKET = 4,
        NOT_PAID = 5,
        PAYMENT_DISCOUNT = 6
    }
    enum CommandCode {
        OPEN_DRAWER = 0,
        QUERY_PRINTER_STATUS = 1,
        REBOOT_WEB_SERVER = 2,
        RESET_PRINTER = 3,
        GET_NATIVE_CODE_FUNCTION = 4,
        DISPLAY_TEXT = 5,
        PRINT_CONTENT_BY_NUMBERS = 6
    }
    enum DataType {
        ALL = 0,
        COMMERCIAL_DOCS = 1,
        INVOICES = 2,
        BOX_OFFICE_TICKETS = 3,
        OBSOLETE = 4
    }
}
