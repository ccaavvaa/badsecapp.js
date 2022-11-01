import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import history from "../context/history";
import AuthContextProvider from "../context/AuthContextProvider";

const Login = () => {
    const { setAuth } = useContext(AuthContextProvider);
    const userRef = useRef<HTMLInputElement>();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    useEffect(() => {
        if (userRef.current) userRef.current.focus();
    }, []);
    useEffect(() => {
        setErrMsg("");
    }, [username, password]);

    const handleLogin = async (): Promise<void> => {
        try {
            const url =
                "/authentication?login=" +
                encodeURIComponent(username) +
                "&password=" +
                encodeURIComponent(password);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });
            const text = await response.text();
            if (response.status > 400) {
                if (response.status === 401) {
                    setErrMsg("Unauthorized");
                    return;
                }
                if (text) {
                    setErrMsg(text);
                    return;
                }
                setErrMsg("Login Failed");
                return;
            }
            setAuth({ user: username, isAuthenticated: true });
            history.replace("/");
        } catch (err) {
            setErrMsg("Login Failed");
            if (userRef.current) userRef.current.focus();
        }
    };
    return (
        <div>
            <Container className="m-auto mt-5">
                <Row>
                    <Col md={2}></Col>
                    <Col md={5}>
                        <Alert key="danger" variant="danger" className={errMsg ? "" : "d-none"}>
                            {errMsg}
                        </Alert>
                        <Form>
                            <Form.Group className="mb-3 m" controlId="formBasicUser">
                                <Form.Label>Login</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={userRef}
                                    value={username}
                                    placeholder="Login"
                                    className="text-muted"
                                    onChange={(e) =>
                                        setUserName((e.target as HTMLInputElement).value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword((e.target as HTMLInputElement).value)
                                    }
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={async () => {
                                    await handleLogin();
                                }}
                            >
                                Sign In
                            </Button>
                        </Form>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
