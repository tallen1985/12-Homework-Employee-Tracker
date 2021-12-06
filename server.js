const cTable = require('console.table');
const inquirer = require('inquirer');
const asciiArt = require('./src/ascii');
const db = require('./db/connection.js');
const viewQueries = require('./src/viewQueries');
const addQueries = require('./src/addQueries')
const updateQueries = require('./src/updateQueries')
require('dotenv').config()


function queryDB(answer) {

    if(answer === "View All Employees"){
        viewQueries.viewAllEmployees().then(result => {
            console.table("\n All Employees", result);
            askQuestions()
        })
    }
    if(answer === "View All Roles") {
        viewQueries.viewAllRoles().then(result => {
            console.table("\n All Roles", result);
            askQuestions()
        })
    }
    if(answer === "View All Departments") {
        viewQueries.viewAllDepartments().then(result => {
            console.table("\n All Departments", result);
            askQuestions()
        })
    }
    if(answer === "Add Employee") {
        addQueries.addEmployee().then((result) => {
            askQuestions()
        })
    }
    if(answer === "Add Role") {
        addQueries.addRole().then((result) => {
            askQuestions()
        })
    }
    if(answer === "Update Employee Role") {
        updateQueries.updateEmployee().then((result) => {
            askQuestions()
        })
    }
    if(answer === "Add Department") {
        addQueries.addDept().then((result) => {
            askQuestions()
        })
    }
    if(answer === "View Employees By Manager") {
        viewQueries.viewEmployeesByManager().then((result) => {
            console.table("\n Employees By Manager", result)
            askQuestions()
        })
    }
    if(answer === "View Salaries by Department") {
        viewQueries.viewSalariesByDepartment().then((result) => {
            console.table("\n Total Salaries By Department", result)
            askQuestions()
        })
    }
}


console.log(asciiArt)

function askQuestions() {
    inquirer.prompt({
                name: 'nextAction',
                type: 'list',
                message: 'What would you like to do?',
                choices: ["View All Employees", "View All Roles","View All Departments","Add Employee","Add Role","Add Department", "Update Employee Role", "View Employees By Manager", "View Salaries by Department" ,'Save and Quit']
            })
    .then(answer => {
        if (answer.nextAction == 'Save and Quit'){
            console.log('Goodbye')
            process.exit();
        } else {
            queryDB(answer.nextAction)
        }
    })
}

askQuestions();
