import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Function to convert numeric permission value to symbolic representation
function convertPermission(number) {
    const permissions = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    if (number >= 0 && number <= 7) {
        return permissions[number];
    } else {
        return "Invalid permission number";
    }
}

function Dir() {
    const [dir, setDir] = useState([]);                     //this state will store the directory contents
    const [currentPath, setCurrentPath] = useState("/");    //this state will store the current path

    //this function will fetch the directory contents from the server
    const fetchDir = async (path) => {
        console.log(path);
        try {
            const response = await axios.post("/getDir", { dir: path }, { withCredentials: true });
            console.log(response.data);
            setDir(response.data.data); // Update the state with the directory contents
            setCurrentPath(path); // Update current path with the path that was passed in the function
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDir(currentPath);
    }, [currentPath]);

    const handleCardClick = (name) => {
        const newPath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
        fetchDir(newPath);
    };

    const handleBackButtonClick = () => {
        if (currentPath === "/") return;
        const path = currentPath.split("/");
        console.log(path);
        path.pop();
        console.log(path);
        let newPath = path.join("/");
        //add a / in the starting if not present
        if (!newPath.startsWith("/")) newPath = `/${newPath}`;
        console.log(newPath);
        fetchDir(newPath);
    };

    return (
        <div>
            <h1>Directory</h1>
            <h3 style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Current Path: {currentPath}</h3>

            <div className="container">
                {currentPath !== "/" && (
                    <Button variant="primary" onClick={handleBackButtonClick} style={{ marginBottom: '10px' }}>
                        Back
                    </Button>
                )}
                <div className="row">
                    <div className="col">
                        <Table striped bordered hover className="table-responsive">
                            <colgroup>
                                <col className="col-2" />
                                <col className="col-2" />
                                <col className="col-2" />
                                <col className="col-2" />
                                <col className="col-2" />
                            </colgroup>

                            <thead className="thead-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Owner</th>
                                    <th>Group</th>
                                    <th>Other</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dir.map((item, index) => (
                                    <tr key={index} onClick={item.isFolder ? () => handleCardClick(item.name) : null} className={item.isFolder ? 'folder-row' : ''} style={{ cursor: item.isFolder ? 'pointer' : 'default' }}>
                                        <td>
                                            <FontAwesomeIcon icon={item.isFolder ? faFolder : faFile} />
                                            {' '}
                                            {item.name}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{item.isFolder ? '-' : `${item.sizeInBytes} B`}</td>
                                        <td style={{ textAlign: 'center' }}>{convertPermission(item.permissions[0])}</td>
                                        <td style={{ textAlign: 'center' }}>{convertPermission(item.permissions[1])}</td>
                                        <td style={{ textAlign: 'center' }}>{convertPermission(item.permissions[2])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dir;
