const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'APIs Sequelize',
            version: '1.0.0',
            description: 'APIs Sequelize | Postgresql',
        },
    },
    apis: ['./routes/*.js', './docs/*/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;