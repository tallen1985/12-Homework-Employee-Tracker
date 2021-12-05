const questions = {
        addDepartment:[
            {
                name: 'title',
                type: 'Input',
                message: "What is the Department's Name?",
                validate: val => val.length > 0 ? true : console.log("Please enter department's name")

            }
        ]

    };
        

module.exports = questions