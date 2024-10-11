import navigationController from "./navigation.js";
import fileOperationsController from "./fileOperations.js";
import systemInfoController from "./systemInfo.js";
import hashAndCompressController from "./hashAndCompress.js";

// const readableStream = new fs.createReadStream('');
const controller = async (input, currentPath, pathInfo) => {
    let callbackData;
    const controllerSections = [
        navigationController,
        fileOperationsController,
        systemInfoController,
        hashAndCompressController
    ];

    for (let section of controllerSections) {
        [ currentPath, pathInfo, callbackData ] = await section(input, currentPath, pathInfo);
        if (callbackData) break;
    }

    if (callbackData !== null) {
        return [ currentPath, pathInfo, callbackData ];
    } else {
        return [ currentPath, pathInfo, 'Invalid input\n' + pathInfo ];
    }
}

export default controller;