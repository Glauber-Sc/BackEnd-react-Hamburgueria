// /* Configurações do sequelize com o postgres */

// module.exports = {
//     dialect: 'postgres',
//     host: 'localhost',
//     username: 'postgres',
//     password: 'postgres',
//     database: 'codeburger',
//     define: {
//         timespamps: true,
//         underscored: true,
//         underscoredAll: true
//     }
// }




module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'codeburger',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
    
}