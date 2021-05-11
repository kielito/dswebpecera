import { body } from 'express-validator';

const schema = [
    body('usuario')
        .isLength({ min: 3, max: 10})
        .withMessage('Usuario debe contener minimo 3 caracteres y maximo 10!'),
    body('password')
        .isLength({ min: 3, max: 10})
        .withMessage('Password debe contener minimo 3 caracteres y maximo 10!')
];

export { schema as registerSchema };