import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { customFetch } from "../context/ajax";
import * as settings from "../config.json";

const Counter = () => {
    const containerRef = useRef<HTMLDivElement>();
    const editRef = useRef<HTMLInputElement>();
    const [pageStr, setPageStr] = useState("0");
    const [valeur, setValeur] = useState(0);
    const [errMsg, setErrMsg] = useState("");

    const dir = settings.ROOT_DIR; // TODO SECU
    const path = dir + "/" + valeur;
    useEffect(() => {
        const getPub = async (): Promise<void> => {
            if (errMsg) {
                return;
            }
            const data = await customFetch(
                `http://localhost:5001/pub?page=${parseInt(pageStr, 10)}`
            );
            if (containerRef.current) {
                containerRef.current.innerHTML = data?.$text || "";
            }
        };
        getPub().catch(console.error);
    });
    const handleClick = async () => {
        const url = `/directory?path=${encodeURIComponent(path)}`;
        const response = await fetch(url, {
            method: "DELETE"
        });
        const text = await response.text();
        if (response.status > 400) {
            if (response.status === 401) {
                setErrMsg("Unauthorized");
                return;
            }
            if (text) {
                setErrMsg(text || response.statusText);
                return;
            }
        } else {
            setValeur(valeur + 1);
            setErrMsg("");
        }
    };
    return (
        <Container className="m-auto mt-5">
            <Row>
                <Col md={2}></Col>
                <Col md={5}>
                    <Form>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={async () => {
                                await handleClick();
                            }}
                        >
                            Delete {path}
                        </Button>
                    </Form>
                </Col>
                <Col md={2}></Col>
            </Row>

            <Row>
                <Col md={2}></Col>
                <Col md={5}>
                    <Alert key="danger" variant="danger" className={errMsg ? "" : "d-none"}>
                        {errMsg}
                    </Alert>
                    <Form>
                        <Form.Group className="mb-3 m" controlId="formPage">
                            <Form.Label>Page pub</Form.Label>
                            <Form.Control
                                type="text"
                                ref={editRef}
                                value={pageStr}
                                placeholder="pub page"
                                className="text-muted"
                                onChange={(e) => {
                                    const value = (e.target as HTMLInputElement).value;
                                    setPageStr(value);
                                    const p = parseInt(value, 10);
                                    setErrMsg(isFinite(p) ? "" : "Numéro de page incorrect");
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={2}></Col>
            </Row>
            <Row>
                <Col md={2}></Col>
                <Col md={5}>
                    <div ref={containerRef}></div>
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    );
};

export default Counter;
