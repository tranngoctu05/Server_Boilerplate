const Joi = require('joi');

const createPostValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required().messages({
            'string.empty': 'Title cannot be empty',
            'string.base': 'Title must be a string',
            'string.min': 'Title must be at least {#limit} characters long'
        }),
        content: Joi.string().min(1).required().messages({
            'string.empty': 'Content cannot be empty',
            'string.base': 'Content must be a string',
            'string.min': 'Content must be at least {#limit} characters long'
        }),
        userId: Joi.string().guid().required().messages({
            'string.empty': 'User ID cannot be empty',
            'string.guid': 'Invalid User ID format',
            'any.required': 'User ID is required'
        })
    });

    return schema.validate(data, { abortEarly: false });
}

const updatePostValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(1).optional().messages({
            'string.empty': 'Title cannot be empty',
            'string.base': 'Title must be a string',
            'string.min': 'Title must be at least {#limit} characters long'
        }),
        content: Joi.string().min(1).optional().messages({
            'string.empty': 'Content cannot be empty',
            'string.base': 'Content must be a string',
            'string.min': 'Content must be at least {#limit} characters long'
        }),
        userId: Joi.string().guid().optional().messages({
            'string.empty': 'User ID cannot be empty',
            'string.guid': 'Invalid User ID format'
        })
    });

    return schema.validate(data, { abortEarly: false });
}

module.exports = {
    createPostValidator,
    updatePostValidator
};
