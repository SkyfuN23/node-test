// const { exec } = require('child_process');

// const backupCommand = 'mongodump --out D:/mongodb'; //CAMBIAR LA RUTA A LA QUE SE QUIERE EXPORTAR "D:/mongodb"

// function backup() {
//     exec(backupCommand, (error, stdout, stderr) => {
//         console.log(`Respaldo completado: ${stdout}`);
//         console.log(`Backup ${new Date().toLocaleDateString()}`);
//     });
// }

// backup();

// setInterval(() => {
//     backup();
// }, 60000 * 60 * 24);