import os from "os";

const systemInfoController = async (input, currentPath, pathInfo) => {
    if (!input.trim().startsWith('os ')) return [ currentPath, pathInfo, null ];

    const splatInput = input.trim().split(' ');
    if (splatInput.length !== 2) return [ currentPath, pathInfo, null ];

    const arg = splatInput.pop();
    if (!arg.startsWith('--')) return [ currentPath, pathInfo, null ];

    if (arg === '--EOL') {
        if (os.EOL.length === 1) {
            console.log('\\n');
        } else {
            console.log('\\r\\n');
        }
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (arg === '--cpus') {
        console.log('Overall amount: ', os.cpus().length);
        console.log(os.cpus());
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (arg === '--homedir') {
        console.log(os.homedir());
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (arg === '--username') {
        console.log(os.userInfo().username);
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (arg === '--architecture') {
        console.log(os.arch());
        return [ currentPath, pathInfo, pathInfo ];
    }

    return [ currentPath, pathInfo, null ];
}

export default systemInfoController;