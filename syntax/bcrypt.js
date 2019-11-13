const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '123456';
const someOtherPlaintextPassword = '111112';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, hash, (err, result) => {
        console.log(myPlaintextPassword);
        console.log(hash);
        console.log('mypassword', result);
    });
    bcrypt.compare(someOtherPlaintextPassword, hash, (err, result) => {
        console.log('other password', result);
    });
});