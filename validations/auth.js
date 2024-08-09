const Joi = require('joi');

const registerValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least {#limit} characters long'
        }),
        username: Joi.string().optional().messages({
            'string.base': 'Username must be a string'
        }),
        bio: Joi.string().optional().messages({
            'string.base': 'Bio must be a string'
        })
    });

    return schema.validate(data, { abortEarly: false });
}

const createUserValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least {#limit} characters long'
        }),
        username: Joi.string().min(1).required().messages({
            'string.empty': 'Username cannot be empty',
            'string.base': 'Username must be a string'
        }),
        bio: Joi.string().optional().messages({
            'string.base': 'Bio must be a string'
        })
    });

    return schema.validate(data, { abortEarly: false });
}
const updateBioValidator = (data) => {
    const schema = Joi.object({
        bio: Joi.string().min(1).required().messages({
            'string.empty': 'Bio cannot be empty',
            'string.base': 'Bio must be a string'
        })
    });

    return schema.validate(data, { abortEarly: false });
}

module.exports = { registerValidator, createUserValidator ,updateBioValidator};
