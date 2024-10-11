import {Transform} from "stream";
import controller from "./controller/index.js";

const transformer = (initPath) => {
    let currentPath = initPath;
    let pathInfo = `You are currently in ${currentPath}\n`;

    return new Transform({
        async transform(chunk, encoding, callback) {
            const input = chunk.toString().trim();
            let callbackData;

            [currentPath, pathInfo, callbackData] = await controller(input, currentPath, pathInfo);

            callback(null, callbackData);
        }
    });
};

export default transformer;