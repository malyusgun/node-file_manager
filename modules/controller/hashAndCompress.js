import { createHash } from 'node:crypto';
import path from "node:path";
import fsPromises from 'node:fs/promises';
import fs from 'node:fs';
import zlib from "node:zlib";

const hashAndCompressController = async (input, currentPath, pathInfo) => {
    const inputText = input;
    if (input.trim().startsWith('hash ') && input.split(' ').length === 2) {
        const file = input.split(' ')[1];
        const filePath = path.resolve(currentPath, file);
        const isPathExist = await fsPromises.stat(filePath, () => {});
        if (!isPathExist) {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
        const hash = new createHash('sha256');
        console.log(hash.update(filePath).digest('hex'));
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (input.trim().startsWith('compress ') && input.split(' ').length === 3) {
        const file = inputText.split(' ')[1];
        const newFile = inputText.split(' ')[2];
        const filePath = path.resolve(currentPath, file);
        const isPathExist = await fsPromises.stat(filePath, () => {});
        if (!isPathExist) {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }

        const newFilePath = path.resolve(currentPath, newFile);

        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(newFilePath);
        const brotli = zlib.createBrotliCompress();

        input.pipe(brotli).pipe(output);
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (input.trim().startsWith('decompress ') && input.split(' ').length === 3) {
        const file = inputText.split(' ')[1];
        const newFile = inputText.split(' ')[2];
        const filePath = path.resolve(currentPath, file);
        const isPathExist = await fsPromises.stat(filePath, () => {});
        if (!isPathExist) {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }

        const newFilePath = path.resolve(currentPath, newFile);

        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(newFilePath);
        const brotli = zlib.createBrotliDecompress();

        input.pipe(brotli).pipe(output);
        return [ currentPath, pathInfo, pathInfo ];
    }
    return [ currentPath, pathInfo, null ];
}

export default hashAndCompressController;