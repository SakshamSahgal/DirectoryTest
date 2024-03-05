const fs = require('fs');
const path = require('path');

async function getFilesAndFolders(directoryPath) {
    try {
        const items = await fs.promises.readdir(directoryPath);
        const result = [];

        for (const item of items) {
            console.log(item)
            const itemPath = path.join(directoryPath, item);
            try {
                const stats = await fs.promises.stat(itemPath);

                result.push({
                    name: item,
                    isFolder: stats.isDirectory()
                });
            } catch (error) {
                // Skip over items for which we don't have permission to read
                console.error('Error reading item:', error);
            }
        }

        return result;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

async function GetDir(req, res) {
    // Example usage:
    console.log(req.body);

    const directoryPath = req.body.dir; // Change this to the desired directory path
    getFilesAndFolders(directoryPath).then(filesAndFolders => {
        res.json({
            success: true,
            data: filesAndFolders
        });
    }).catch(error => {

        console.error('Error reading directory:', error);

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    });
}

module.exports = { GetDir };
