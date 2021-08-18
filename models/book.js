'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {};
    Book.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "'Title' can not be blank"
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "'Author' can not be blank"
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
            validate: {
                isInt: {
                    msg: "'Year' can not contain numeric values/integers"
                }
            }
        }
    }, { sequelize })

    return Book;
}