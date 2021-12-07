const pool = require('../db/connection')
const viewQueries = require('../src/viewQueries')
const inquirer = require('inquirer');

const deleteItem = async (table) => {
    let choiceArray = [];
    if (table === "role") {
        choiceArray = await viewQueries.getRoleNames();
    } else if (table === 'employees') {
        choiceArray = await viewQueries.getEmployeeNames();
    } else {
        choiceArray = await viewQueries.getDeptNames();
    }

    const response = await inquirer.prompt({
        name: "deleteItem",
        type: 'list',
        message: "Which one?",
        choices: choiceArray,
        filter: val => (choiceArray.indexOf(val) + 1)
    })

    const [rows, fields] = await pool.query('DELETE FROM ?? WHERE id = ?', [table, response.deleteItem])

    console.log('Successfully Deleted')
    return rows;
}
module.exports = {
    deleteItem
}