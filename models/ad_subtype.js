const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    'ad_subtype',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
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
        },
        ad_typeid:{
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    }
)