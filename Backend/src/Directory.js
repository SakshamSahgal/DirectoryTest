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
                const permissions = stats.mode.toString(8).slice(-3); // Extract last 3 digits representing permissions
                console.log(stats)
                //if it is a directory
                if (stats.isDirectory()) {
                    result.push({
                        name: item,
                        isFolder: stats.isDirectory(),
                        permissions: permissions,
                    });
                } else {
                    // const fileUrl = process.env.BASE_URL + '/' + item;
                    result.push({
                        name: item,
                        isFolder: stats.isDirectory(),
                        sizeInBytes: stats.size, // in bytes
                        permissions: permissions,
                    });
                }
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

    console.log(req.body);

    if (!req.body.dir) {
        return res.status(400).json({
            success: false,
            error: 'Directory path not provided'
        })
    }

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


function downloadFile(req, res) {
    console.log(req.body);
    const filePath = req.body.path;

    // Check if the file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // If the file doesn't exist or is not a regular file, respond with 404 Not Found
            return res.status(404).send('File not found');
        }

        // Set appropriate headers for file download
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
        res.setHeader('Content-Length', stats.size);

        // Stream the file contents to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
}

module.exports = { GetDir, downloadFile };
