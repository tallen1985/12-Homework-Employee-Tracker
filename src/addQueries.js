const pool = require('../db/connection')
const inquirer = require('inquirer');
const viewQueries = require('../src/viewQueries')

const addRole = async () => {
    const deptArray = await viewQueries.getDeptNames()
    const response = await inquirer.prompt([
    {
        name: 'title',
        type: 'input',
        message: "What is the Role's name?",
        validate: val => val.length > 0 ? true : console.log("Please enter roles's name")
    },
    {
        name: 'salary',
        type: "number",
        message: "What is the Role's Salary",
        validate: val => (val) ? true : console.log("Please enter roles's salary")
    },
    {
        name: 'dept',
        type: "list",
        message: "What Dept does this role fall under?",
        choices: deptArray,
        filter: val => (deptArray.indexOf(val) + 1)
    }
    ])
    
    const {title, salary, dept} = response;
    const [rows, fields] = await pool.query('INSERT INTO role(title, salary, department_id) VALUES (?,?,?)', [title, salary, dept])

    console.log(`successfully added ${title} to Roles`)
    return rows;
}

const addEmployee = async () => {
    const roleArray = await viewQueries.getRoleNames()
    const empArray = await viewQueries.getEmployeeNames()
    const response = await inquirer.prompt([
        {
            name: 'firstName',
            type: 'Input',
            message: "What is the first name?",
            validate: val => val.length > 0 ? true : console.log("Please enter roles's name")
        },
        {
            name: 'lastName',
            type: "input",
            message: "What is the last name",
            validate: val => val.length > 0 ? true : console.log("Please enter roles's salary")
        },
        {
            name: 'role',
            type: "list",
            message: "What Dept does this role fall under?",
            choices: roleArray,
            filter: val => (roleArray.indexOf(val) + 1)
        },
        {
            name: 'manager',
            type: "list",
            message: "Who is this employee's manager",
            choices: empArray,
            filter: val => {
                if (val === 'None') {
                    return null;
                } else {
                    return (empArray.indexOf(val))
                }
            }
        }
        ])

        const {firstName, lastName, role, manager} = response;

        await pool.query('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [firstName, lastName, role, manager])

        console.log(`successfully added ${firstName} ${lastName} to Employees Table`)
}

module.exports = {
    addRole,
    addEmployee
}