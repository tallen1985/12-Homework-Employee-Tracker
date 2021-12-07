//load modules
const cTable = require('console.table');
const inquirer = require('inquirer');
const asciiArt = require('./src/ascii');
const db = require('./db/connection.js');
const viewQueries = require('./src/viewQueries');
const addQueries = require('./src/addQueries')
const updateQueries = require('./src/updateQueries');
const deleteQueries = require('./src/deleteQueries');
require('dotenv').config()

//process the answer to the recurring question and perform the choice
function queryDB(answer) {
    const choice = answer.nextAction;
    if(choice === "View All Employees"){
        viewQueries.viewAllEmployees().then(result => {
            console.table("\n All Employees", result);
            askQuestions()
        })
    }
    if(choice === "View All Roles") {
        viewQueries.viewAllRoles().then(result => {
            console.table("\n All Roles", result);
            askQuestions()
        })
    }
    if(choice === "View All Departments") {
        viewQueries.viewAllDepartments().then(result => {
            console.table("\n All Departments", result);
            askQuestions()
        })
    }
    if(choice === "Add Employee") {
        addQueries.addEmployee().then((result) => {
            askQuestions()
        })
    }
    if(choice === "Add Role") {
        addQueries.addRole().then((result) => {
            askQuestions()
        })
    }
    if(choice === "Update Employee Role") {
        updateQueries.updateEmployee().then((result) => {
            askQuestions()
        })
    }
    if(choice === "Add Department") {
        addQueries.addDept().then((result) => {
            askQuestions()
        })
    }
    if(choice === "View Employees By Manager") {
        viewQueries.viewEmployeesByManager().then((result) => {
            console.table("\n Employees By Manager", result)
            askQuestions()
        })
    }
    if(choice === "View Salaries by Department") {
        viewQueries.viewSalariesByDepartment().then((result) => {
            console.table("\n Total Salaries By Department", result)
            askQuestions()
        })
    }
    if(choice === 'Delete...') {
        deleteQueries.deleteItem(answer.deleteTable).then((result) => {
            askQuestions()
        })
    }
}

//big fancy art at top of program
console.log(asciiArt)

//reoccuring function to keep program going
function askQuestions() {
    inquirer.prompt([{
                name: 'nextAction',
                type: 'list',
                message: 'What would you like to do?',
                choices: ["View All Employees", "View All Roles","View All Departments","Add Employee","Add Role","Add Department", "Update Employee Role", "View Employees By Manager", "View Salaries by Department", 'Delete...' ,'Save and Quit']
            },
            {
                name: "deleteTable",
                type: 'list',
                message:'What would you like to delete?',
                choices: ["Department", "Role", "Employee"],
                when: (val) => (val.nextAction === 'Delete...'),
                filter: (val) => {
                    if (val === "Employee") {
                        return 'employees'
                    } else if (val === 'Department') {
                        return 'departments'
                    } else {
                        return 'role'
                    }
                }
            }
        ])
    .then(answer => {
        //if they answer 'save and quit' then kill the process and close file
        if (answer.nextAction == 'Save and Quit'){
            console.log('Goodbye')
            process.exit();
        } else {
            queryDB(answer)
        }
    })
}
//start the program
askQuestions();
