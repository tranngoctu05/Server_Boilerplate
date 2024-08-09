const config = Object.freeze({
    SECRET: process.env.SECRET,
    SECRET_REFRESH: process.env.SECRET_REFRESH,
    tokenLife: process.env.TOKENLIFE,
    refreshTokenLife: process.env.SECRET_REFRESH
})

module.exports = config;