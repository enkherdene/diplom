const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    'duration_type',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    }
)