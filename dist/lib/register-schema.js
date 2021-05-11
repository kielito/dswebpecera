"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const express_validator_1 = require("express-validator");
const schema = [
    express_validator_1.body('usuario')
        .isLength({ min: 3, max: 10 })
        .withMessage('Usuario debe contener minimo 3 caracteres y maximo 10!'),
    express_validator_1.body('password')
        .isLength({ min: 3, max: 10 })
        .withMessage('Password debe contener minimo 3 caracteres y maximo 10!')
];
exports.registerSchema = schema;
//# sourceMappingURL=register-schema.js.map