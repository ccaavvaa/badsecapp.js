import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./context/AuthContextProvider";

import App from "./App";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "./context/history";

const container = document.getElementById("root");

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <HistoryRouter history={history}>
                <App />
            </HistoryRouter>
        </AuthProvider>
    </React.StrictMode>,
    container
);
