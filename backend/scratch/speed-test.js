const bcrypt = require('bcrypt');

const password = 'password123';
const startHash = Date.now();
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        const endHash = Date.now();
        console.log(`Hashing took: ${endHash - startHash}ms`);

        const startCompare = Date.now();
        bcrypt.compare(password, hash, (err, res) => {
            const endCompare = Date.now();
            console.log(`Compare took: ${endCompare - startCompare}ms`);
            process.exit(0);
        });
    });
});
