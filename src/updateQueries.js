const pool = require('../db/connection')
const viewQueries = require('../src/viewQueries')
const inquirer = require('inquirer');

const updateEmployee = async () => {
    const empArray = await viewQueries.getEmployeeNames();
    const roleArray = await viewQueries.getRoleNames();

    const response = await inquirer.prompt([{
        name: "employee",
        type: 'list',
        message: "Which employee's role would you like to change?",
        choices: empArray,
        filter: val => (empArray.indexOf(val))
    },
    {
        name: "newRole",
        type: 'list',
        message: "What role will this employee be filling?",
        choices: roleArray,
        filter: val => (roleArray.indexOf(val) + 1)
    }])

    const {newRole, employee} = response;


    const [rows, fields] = await pool.query("UPDATE employees SET role_id = ? WHERE id = ?", [newRole, employee])

    console.log('Updated Employee')
    return;
}



module.exports = {
    updateEmployee
}