"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultServer = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
class DefaultServer {
    static create() {
        const app = express_1.default();
        return app;
    }
}
exports.DefaultServer = DefaultServer;
//# sourceMappingURL=default-server.fixture.js.map