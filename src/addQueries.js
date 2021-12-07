//load modules
const pool = require('../db/connection')
const inquirer = require('inquirer');
const viewQueries = require('../src/viewQueries')

//role to add item to Role Database
const addRole = async () => {
    //query DB for dept names and ask questions
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
        message: "What dept does this role fall into?",
        choices: deptArray,
        filter: val => (deptArray.indexOf(val) + 1)
    },
    ])
    //destructure response and then create SQL statement to add entry using destructured items
    const {title, salary, dept} = response;
    const [rows, fields] = await pool.query('INSERT INTO role(title, salary, department_id) VALUES (?,?,?)', [title, salary, dept])
    
    //let user know added and return
    console.log(`successfully added ${title} to Roles`)
    return rows;
}

//function to create a new employee
const addEmployee = async () => {
    //queries to get role names and employee names to be used in questions, then ask questions
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
            message: "What roll does this employoee do?",
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
        //destructure response
        const {firstName, lastName, role, manager} = response;
        //query to insert employee into database
        await pool.query('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [firstName, lastName, role, manager])

        console.log(`successfully added ${firstName} ${lastName} to Employees Table`)
}
// add a department to database
const addDept = async () => {
    //ask question
    const result = await inquirer.prompt({
        name: 'name',
        type: 'Input',
        message: "What is the new Department's name?",
        validate: val => val.length > 0 ? true : console.log("Please enter roles's name")
    })
    //insert department into database
    await pool.query("INSERT INTO departments(name) VALUES (?)", [result.name])
    //inform user
    console.log(`successfully added ${result.name} to Department table`)
}
//export functions
module.exports = {
    addRole,
    addEmployee,
    addDept
}