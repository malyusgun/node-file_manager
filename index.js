import startManager from "./modules/main.js";

const args = process.argv.slice(2);
const userName = args.find(arg => arg.startsWith('--username='))?.slice(11);

if (userName) {
    await startManager(userName);
}