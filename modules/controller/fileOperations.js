import path from "node:path";
import fs from "fs";
import fsPromises from "fs/promises";

const fileOperationsController = async (input, currentPath, pathInfo) => {
    if (input.trim().startsWith('cat ') && input.split(' ').length === 2) {
        const file = input.split(' ')[1];
        const filePath = path.resolve(currentPath, file);
        try {
            const isFileExist = await fsPromises.stat(filePath, () => {});
            if (isFileExist.isDirectory()) return [ currentPath, pathInfo, 'Operation failed\n', + pathInfo ];
            const readableStream = fs.createReadStream(filePath);
            readableStream.on('data', (chunk) => {
                process.stdout.write(chunk + '\n' + pathInfo);
            })

            // if it's a reading of empty txt file
            const content = (await fsPromises.readFile(filePath)).toString();
            if (!content) {
                await fsPromises.writeFile(filePath, '');
                process.stdout.write('\n' + pathInfo);
            }
            return [ currentPath, pathInfo, '' ];
        } catch {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
    }

    if (input.trim().startsWith('add ') && input.split(' ').length === 2) {
        const newFile = input.split(' ')[1];
        const filePath = path.resolve(currentPath, newFile);
        try {
            // try to read non-existent file/dir
            const isFileExist = await fsPromises.stat(filePath, () => {});
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        } catch {
            // file/dir doesn't exist, do what the user wants
            await fsPromises.writeFile(filePath, '');
            return [ currentPath, pathInfo, pathInfo ];
        }
    }

    if (input.trim().startsWith('rn ') && input.split(' ').length === 3) {
        const prevFileName = input.split(' ')[1];
        const newFileName = input.split(' ')[2];
        const filePath = path.resolve(currentPath, prevFileName);
        const newFilePath = path.resolve(currentPath, newFileName);
        try {
            const isFileExist = await fsPromises.stat(filePath, () => {});
            if (isFileExist.isDirectory()) return [ currentPath, pathInfo, 'Operation failed\n', + pathInfo ];
            await fsPromises.rename(filePath, newFilePath);
            return [ currentPath, pathInfo, pathInfo ];
        } catch {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
    }

    if (input.trim().startsWith('cp ') && input.split(' ').length === 3) {
        const prevFile = input.split(' ')[1];
        const newFile = input.split(' ')[2];
        const filePath = path.resolve(currentPath, prevFile);
        const newFilePath = path.resolve(currentPath, newFile);
        try {
            const isFileExist = await fsPromises.stat(filePath, () => {});
            if (isFileExist.isDirectory()) return [ currentPath, pathInfo, 'Operation failed\n', + pathInfo ];
            const readableStream = fs.createReadStream(filePath);
            const writableStream = fs.createWriteStream(newFilePath);
            readableStream.on('data', (chunk) => {
                writableStream.write(chunk);
                process.stdout.write(pathInfo);
            })

            // if it's a copying of empty txt file
            const content = (await fsPromises.readFile(filePath)).toString();
            if (!content) {
                await fsPromises.writeFile(newFilePath, '');
                process.stdout.write(pathInfo);
            }
            return [ currentPath, pathInfo, '' ];
        } catch {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
    }

    if (input.trim().startsWith('mv ') && input.split(' ').length === 3) {
        const prevFile = input.split(' ')[1];
        const newFile = input.split(' ')[2];
        const prevFilePath = path.resolve(currentPath, prevFile);
        const newFilePath = path.resolve(currentPath, newFile);

        try {
            const isFileExist = await fsPromises.stat(prevFilePath, () => {});
            if (isFileExist.isDirectory()) return [ currentPath, pathInfo, 'Operation failed\n', + pathInfo ];

            const readableStream = fs.createReadStream(prevFilePath);
            const writableStream = fs.createWriteStream(newFilePath);
            const deleteAndLog = () => {
                fs.unlinkSync(prevFilePath);
                process.stdout.write(pathInfo);
            };
            readableStream.on('data', (chunk) => {
                writableStream.write(chunk);
                deleteAndLog();
            });

            // if it's a moving of empty txt file
            const content = (await fsPromises.readFile(prevFilePath)).toString();
            if (!content) {
                await fsPromises.writeFile(newFilePath, '');
                deleteAndLog();
            }
            return [ currentPath, pathInfo, '' ];
        } catch {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
    }

    if (input.trim().startsWith('rm ') && input.split(' ').length === 2) {
        const file = input.split(' ')[1];
        const filePath = path.resolve(currentPath, file);
        try {
            const isFileExist = await fsPromises.stat(filePath, () => {});
            await fsPromises.unlink(filePath);
            return [ currentPath, pathInfo, pathInfo ];
        } catch {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
    }
    return [ currentPath, pathInfo, null ];
}

export default fileOperationsController;