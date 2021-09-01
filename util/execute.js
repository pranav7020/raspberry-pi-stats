const { promisify } = require('util');

const exec = promisify(require("child_process").exec)

exports.run = (cmd) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { stdout } = await exec(cmd);

            return stdout ? resolve(stdout.trim()) : resolve(null);
        } catch (err) {
            resolve(null)
        }
    })
}