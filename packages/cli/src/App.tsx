import Main from "./components/Main";
import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import { Container, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import * as Icon from "react-bootstrap-icons";
import AuthContextProvider from "./context/AuthContextProvider";

const App: React.FC = () => {
    const { auth, setAuth } = useContext(AuthContextProvider);
    const handleLogin = async (): Promise<void> => {
        try {
            const response = await fetch("/authentication/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });
            await response.text();
        } catch {
            //
        }
        setAuth({ isAuthenticated: false });
    };
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <Icon.BrowserChrome />
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/">
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer
                                to="/login"
                                className={auth.isAuthenticated ? "d-none" : ""}
                            >
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/people">
                                <Nav.Link className={auth.isAuthenticated ? "" : "d-none"}>
                                    People
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/counter">
                                <Nav.Link>Counter</Nav.Link>
                            </LinkContainer>
                            <Nav.Link
                                className={auth.isAuthenticated ? "" : "d-none"}
                                onClick={async () => {
                                    await handleLogin();
                                }}
                            >
                                Logout
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Main />
        </>
    );
};

export default App;
