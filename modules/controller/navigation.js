import path from "node:path";
import fs from "fs/promises";

const navigationController = async (input, currentPath, pathInfo) => {
    if (input.trim() === 'up') {
        currentPath = path.dirname(currentPath);
        pathInfo = `You are currently in ${currentPath}\n`;
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (input.trim().startsWith('cd ') && input.split(' ').length === 2) {
        const pathTo = input.split(' ')[1];
        const newPath = path.resolve(currentPath, pathTo);
        const isPathExist = await fs.stat(newPath, () => {});
        if (!isPathExist) {
            return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];
        }
        currentPath = path.join(currentPath, pathTo);
        pathInfo = `You are currently in ${currentPath}\n`;
        return [ currentPath, pathInfo, pathInfo ];
    }

    if (input.trim() === 'ls') {
        const catalog = [];
        const pathStat = await fs.stat(currentPath, () => {});
        if (pathStat.isFile()) return [ currentPath, pathInfo, 'Operation failed\n' + pathInfo ];

        const dir = await fs.readdir(currentPath);
        if (dir.length === 0) return [ currentPath, pathInfo, 'Nothing in the catalog\n' + pathInfo ];

        const dirs = [];
        for (let i = 0; i < dir.length; i++) {
            const itemPath = path.resolve(currentPath, dir[i]);
            const dirStat = await fs.stat(itemPath, () => {
            });
            if (dirStat.isDirectory()) {
                dirs.push(dir[i]);
            }
        }

        const files = dir.filter(item => {
            return !(~dirs.indexOf(item));
        });

        for (let i = 0; i < dirs.length; i++) {
            catalog.push({
                Name: dirs[i],
                Type: 'directory'
            })
        }
        for (let i = 0; i < files.length; i++) {
            catalog.push({
                Name: files[i],
                Type: 'file'
            })
        }
        console.table(catalog);
        return [ currentPath, pathInfo, pathInfo ];
    }

    return [ currentPath, pathInfo, null ];
}

export default navigationController;