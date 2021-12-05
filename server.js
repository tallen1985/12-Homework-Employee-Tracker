const cTable = require('console.table');
const inquirer = require('inquirer');
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
    let sql = '';
    answerArray = answer.split(' ')
    const method = answerArray[0].toLowerCase();
    let table = answerArray[answerArray.length - 1]
    if (table == 'Roles' || table == "Role") {
            table = 'role'
        }
    if(method === 'view'){
        if (table === "Employees") {
            sql = 'SELECT employees.first_name, employees.last_name, role.title, departments.name AS "Department", salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager  FROM employees LEFT JOIN role ON employees.role_id = role.id JOIN departments ON role.department_id = departments.id LEFT JOIN employees AS Manager ON employees.manager_id = Manager.id'
        }
        db.query(sql, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.table(result);
            askQuestions()
            }
            
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
        if (table === 'Employee') {
            db.query('SELECT title FROM role', (err, info) => {
                const roleArray = []
                for (role of info){
                    roleArray.push(role.title)
                }
                db.query('SELECT first_name, last_name FROM employees', (err, info) => {
                    const empArray = ['None']
                    for (emp of info){
                        empArray.push(`${emp.first_name} ${emp.last_name}`)
                    }
                inquirer.prompt([
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
                            (deptArray.indexOf(val) + 2)
                        }
                    }
                }
            ])
                .then((response) => {
                    const {firstName, lastName, role, manager} = response;
                    db.query('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [firstName, lastName, role, manager], (error, info) => {
                        if(error){
                            console.log(error)
                        } else {
                        console.log(`successfully added ${firstName} ${lastName} to Departments`)
                        askQuestions();
                        }
                    }) 
                })
            })
        })
    }
    }
    if (method === 'update') {
        db.query("SELECT first_name, last_name FROM employees", (error, info) => {
                const empArray = []
                for (emp of info) {
                    empArray.push(`${emp.first_name} ${emp.last_name}`)
                }
            db.query("SELECT title FROM role", (error, info) => {
                const roleArray = []
                for (role of info){
                    roleArray.push(role.title)
                }
                inquirer.prompt([{
                    name: "employee",
                    type: 'list',
                    message: "Which employee's role would you like to change?",
                    choices: empArray,
                    filter: val => (empArray.indexOf(val) + 1)
                },
                {
                    name: "newRole",
                    type: 'list',
                    message: "What role will this employee be filling?",
                    choices: roleArray,
                    filter: val => (roleArray.indexOf(val) + 1)
                }]).then(response => {
                    const {newRole, employee} = response;
                    db.query("UPDATE employees SET role_id = ? WHERE id = ?", [newRole, employee], (error, info) => {
                        if(error){
                            console.log(error)
                        } else {
                        console.log(`successfully updated role`)
                        askQuestions();
                        }
                    })
                })
            })
        })
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
