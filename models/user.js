const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        user_type: {
            type: Sequelize.INTEGER
        },
        start_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        end_date: {
            type: Sequelize.DATE,
        },
        status:{
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    }
)