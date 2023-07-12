// const generatePassword = async () => {
//     const code = Math.floor(Math.random() * 1000000);
//     return code;
// }
// module.exports = generatePassword
function generatePassword(length) {
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
        result += randomDigit.toString();
    }

    return result;
}

module.exports = generatePassword;
