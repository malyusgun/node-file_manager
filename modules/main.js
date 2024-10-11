import os from "node:os";
import transformer from "./transformer.js";

const startManager = async (userName) => {
    let currentPath = os.homedir();
    process.stdout.write(`Welcome to the File Manager, ${userName}!\n`);
    process.stdout.write(`You are currently in ${currentPath}\n`);

    process.stdin.pipe(await transformer(currentPath)).pipe(process.stdout);

    process.on('SIGINT', () => {
        console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
        process.exit(0);
    });
}

export default startManager;