//load modules
const pool = require('../db/connection')

//query to view all Employees
const viewAllEmployees = async () => {
    const [rows, fields] = await pool.query('SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS "Department", salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager  FROM employees LEFT JOIN role ON employees.role_id = role.id LEFT JOIN departments ON role.department_id = departments.id LEFT JOIN employees AS Manager ON employees.manager_id = Manager.id'); 

    return rows
}
//query to view all roles
const viewAllRoles = async () => {
    const [rows, fields] = await pool.query('SELECT role.id, title, salary, departments.name AS "Department"FROM role JOIN departments ON role.department_id = departments.id'); 

    return rows
}
//query to view all departments
const viewAllDepartments = async () => {
    const [rows, fields] = await pool.query('SELECT * FROM departments'); 

    return rows
}
//extra credit section!!!
const viewEmployeesByManager = async () => {
    const [rows, fields] = await pool.query("select CONCAT(managers.first_name,' ', managers.last_name) as 'Manager Name', employees.first_name, employees.last_name from employees left join employees as managers on employees.manager_id = managers.id order by managers.id"); 

    return rows
}
const viewSalariesByDepartment = async () => {
    const [rows, fields] = await pool.query("select departments.name as 'Dept. Name', sum(role.salary) as 'Total Salary' from role Join departments on role.department_id = departments.id group by departments.name")

    return rows;
}
//query to get department names for addition queries
const getDeptNames = async () => {
    const [rows, fields] = await pool.query('SELECT name FROM departments')
    const deptArray = []
    for (dept of rows){
        deptArray.push(dept.name)
    }
    console.log(deptArray)
    return deptArray;
}
//query to get role names for addition queries
const getRoleNames = async () => {
    const [rows, fields] = await pool.query('SELECT title FROM role')
    const roleArray = []
    for (role of rows){
        roleArray.push(role.title)
    }
    return roleArray;
}
//get employee names for addition queries
const getEmployeeNames = async () => {
    const [rows, fields] = await pool.query('SELECT first_name, last_name FROM employees')
    const empArray = ['None']
    for (emp of rows){
        empArray.push(`${emp.first_name} ${emp.last_name}`)
    }
    return empArray
}
//export functions
module.exports = {
   viewAllEmployees,
   viewAllRoles,
   viewAllDepartments,
   viewEmployeesByManager,
   viewSalariesByDepartment,
   getDeptNames, 
   getRoleNames,
   getEmployeeNames,
   
}