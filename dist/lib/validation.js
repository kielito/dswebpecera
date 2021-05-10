"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestSchema = void 0;
const express_validator_1 = require("express-validator");
function validateRequestSchema(req, res, next) {
    const result = express_validator_1.validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
        //return res.status(400).json({errores: result.array()[0].msg});
        //req.flash('error',result.array()[0].msg);
        for (let i = 0; i < result.array().length; i++) {
            req.flash('error', result.array()[i].msg);
        }
        return res.redirect("./signup");
    }
    next();
}
exports.validateRequestSchema = validateRequestSchema;
//# sourceMappingURL=validation.js.map