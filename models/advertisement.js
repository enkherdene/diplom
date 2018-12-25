const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    'advertisement',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        about: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING

        },
        price: {
            type: Sequelize.INTEGER

        },
        duration: {
            type: Sequelize.INTEGER

        },
        duration_type: {
            type: Sequelize.INTEGER

        },
        freelancer_id: {
            type: Sequelize.INTEGER

        },
        ad_type: {
            type: Sequelize.INTEGER

        },
        ad_subtype: {
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