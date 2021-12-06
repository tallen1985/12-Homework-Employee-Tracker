const pool = require('../db/connection')

const viewAllEmployees = async () => {
    const [rows, fields] = await pool.query('SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS "Department", salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager  FROM employees LEFT JOIN role ON employees.role_id = role.id JOIN departments ON role.department_id = departments.id LEFT JOIN employees AS Manager ON employees.manager_id = Manager.id'); 

    return rows
}

const viewAllRoles = async () => {
    const [rows, fields] = await pool.query('SELECT role.id, title, salary, departments.name AS "Department"FROM role JOIN departments ON role.department_id = departments.id'); 

    return rows
}

const viewAllDepartments = async () => {
    const [rows, fields] = await pool.query('SELECT * FROM departments'); 

    return rows
}

const getDeptNames = async () => {
    const [rows, fields] = await pool.query('SELECT name FROM departments')
    const deptArray = []
    for (dept of rows){
        deptArray.push(dept.name)
    }
    console.log(deptArray)
    return deptArray;
}

const getRoleNames = async () => {
    const [rows, fields] = await pool.query('SELECT title FROM role')
    const roleArray = []
    for (role of rows){
        roleArray.push(role.title)
    }
    return roleArray;
}

const getEmployeeNames = async () => {
    const [rows, fields] = await pool.query('SELECT first_name, last_name FROM employees')
    const empArray = ['None']
    for (emp of rows){
        empArray.push(`${emp.first_name} ${emp.last_name}`)
    }
    return empArray
}

module.exports = {
   viewAllEmployees,
   viewAllRoles,
   viewAllDepartments,
   getDeptNames, 
   getRoleNames,
   getEmployeeNames
}