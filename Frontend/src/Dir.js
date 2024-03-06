import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';


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
            <h3>Current Path: {currentPath}</h3>
            <div className="container">
                {currentPath !== "/" && (
                    <Button variant="primary" onClick={handleBackButtonClick} style={{ marginBottom: '10px' }}>
                        Back
                    </Button>
                )}
                <div className="row">
                    {dir.map((item, index) => (
                        (item.isFolder) ? (
                            <Card style={{ width: '18rem', cursor: 'pointer' }} className="col-md-4 my-3" key={index} onClick={() => handleCardClick(item.name)}>
                                <Card.Body>
                                    <Card.Title><FontAwesomeIcon icon={faFolder} /> {item.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        ) : (
                            <Card className="col-md-4 my-3" key={index} >
                                <Card.Body>
                                    <Card.Title><FontAwesomeIcon icon={faFile} /> {item.name}  <span > ({item.sizeInBytes} B)</span></Card.Title>
                                </Card.Body>
                            </Card>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dir;
