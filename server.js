const cTable = require('console.table');
const inquirer = require('inquirer');
const questions = require('./src/questions');
const asciiArt = require('./src/ascii');
const mySQL = require('mysql2')
require('dotenv').config()

const db = mySQL.createConnection(
    {
      host: process.env.DB_HOST,
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the classlist_db database.`)
  );


function queryDB(answer) {
    answerArray = answer.split(' ')
    const method = answerArray[0].toLowerCase();
    let table = answerArray[answerArray.length - 1]
    if (table == 'Roles' || table == "Role") {
            table = 'role'
        }
    if(method === 'view'){
        
        db.query('SELECT * FROM ??', table, (error, result) => {
            console.table(result);
            askQuestions()
        }) 
    }
    if (method === 'add') {
        if (table === 'role') {
            db.query('SELECT name FROM departments', (err, info) => {
                const deptArray = []
                for (dept of info){
                    deptArray.push(dept.name)
                }
                inquirer.prompt([
                    {
                        name: 'title',
                        type: 'Input',
                        message: "What is the Role's name?",
                        validate: val => val.length > 0 ? true : console.log("Please enter roles's name")
                    },
                    {
                        name: 'salary',
                        type: "Number",
                        message: "What is the Role's Salary",
                        validate: val => val.length > 0 ? true : console.log("Please enter roles's salary")
                    },
                    {
                        name: 'dept',
                        type: "list",
                        message: "What Dept does this role fall under?",
                        choices: deptArray,
                        filter: val => (deptArray.indexOf(val) + 1)
                    }
                ])
                    .then((response) => {
                        const {title, salary, dept} = response;
                        db.query('INSERT INTO role(title, salary, department_id) VALUES (?,?,?)', [title, salary, dept], (error, info) => {
                            if(error) {
                                console.log(error)
                            } else {
                                console.log(`successfully added ${title} to Roles`)
                            askQuestions();
                            }
                            
                    }) 
                })
            })
        }
        if (table === 'Department') {
            inquirer.prompt({
                name: 'title',
                type: 'Input',
                message: "What is the Department's Name?",
                validate: val => val.length > 0 ? true : console.log("Please enter department's name")

            })
                .then((response) => {
                    const {title} = response;
                    db.query('INSERT INTO departments(name) VALUES (?)', title, (error, info) => {
                        if(error){
                            console.log(error)
                        } else {
                        console.log(`successfully added ${title} to Departments`)
                        askQuestions();
                        }
                    }) 
                })
            }
        }
}


console.log(asciiArt)

function askQuestions() {
    inquirer.prompt({
                name: 'nextAction',
                type: 'list',
                message: 'What would you like to do?',
                choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", 'Save and Quit']
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
