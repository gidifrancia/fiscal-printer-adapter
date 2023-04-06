import { AnyObj } from "../common.type";
export declare namespace CustomProtocol {
    type OpenDrawer = {
        operator?: string;
    };
    type Receipt = {
        operator?: string;
        sales?: Sale[];
        lottery?: Lottery;
        refunds?: Refund[];
        subtotals?: Subtotal[];
        payments?: Payment[];
        barCode?: BarCode;
        qrCode?: QrCode;
        graphicCoupon?: GraphicCoupon;
        openDrawer?: OpenDrawer;
        personalTaxCode?: Message;
        beginDisplayText?: DisplayText;
        endDisplayText?: DisplayText;
    };
    type Report = {
        type: ReportType;
        operator?: string;
        timeout?: number;
        openDrawer?: OpenDrawer;
    };
    type Cancel = {
        docRefZ: string;
        docRefNumber: string;
        docDate: string;
        printPreview?: EnableType;
        fiscalSerial?: string;
        checkOnly?: EnableType;
        codLottery?: string;
        cancelRecItems?: CommonSale[];
    };
    type Command = {
        code: CommandCode;
        data?: AnyObj;
    };
    type Sale = {
        type: ItemType;
        operations?: Operation[];
    } & CommonSale;
    type CommonSale = {
        description?: string;
        quantity: number;
        unitPrice: number;
        department?: number;
        idVat?: number;
    };
    type Lottery = {
        code: string;
    };
    type Message = {
        /**
         * Line of text to be printed (maximum 42 characters).
         * The maximum lengths are set based on the "font" attribute.
         * Additional characters are truncated.
         */
        message: string;
        /**
         * Type of line to print:
         *
         * 1 = additional descriptive line (sales body)
         * 2 = additional line in payments
         * 3 = line issued after payment
         * 4 = courtesy line
        */
        messageType: string;
        /**
         * Font type:
         * 1 = normal
         * 2 = bold
         * 3 = 42 characters long
         * 4 = double height
         * 5 = double width
         * 6 = italics
         * 7 = length 42, double height
         * 8 = length 42, bold
         * 9 = length 42, bold, double height
         * C = normal, used for printing the customer in the tax invoice
         * P = normal, used to print the return receipt number in a credit note
         * B = normal, used for printing the customer ID (Scontrino Parlante)
         */
        font: string;
    };
    type DisplayText = {
        data: string;
    };
    type Refund = {
        type: ItemType;
    } & CommonSale;
    type Subtotal = {
        type: ItemType;
        operations?: Operation[];
    };
    type Payment = {
        paymentType?: PaymentType;
        description?: string;
        payment?: number;
        paymentQty?: number;
    };
    type Operation = {
        adjustmentType: AdjustmentType;
        amount: number;
        description?: string;
        department?: number;
        idVat?: number;
        quantity?: number;
    };
    type GraphicCoupon = {
        format?: string;
        value?: string;
        operator?: string;
    };
    type PersonTaxCode = {
        code: string;
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
    enum EnableType {
        DISABLE = 0,
        ABLE = 1
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
    enum AdjustmentType {
        SURCHARGE_DEPARTMENT = 2,
        DISCOUNT_DEPARTMENT = 3
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
        RESET_PRINTER = 2,
        GET_NATIVE_CODE_FUNCTION = 3,
        GET_INFO = 4,
        DISPLAY_TEXT = 5
    }
}
