const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    'freelancer',
    {
        id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      registation_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATE
      },
      phone: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER
      }
    },
    {
        timestamps: false
    }
)