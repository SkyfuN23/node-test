import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Carga from './routes/Carga.jsx';
import Historial from './routes/Historial.jsx';
import Lista from './routes/Lista.jsx';
import Login from './routes/Login.jsx';
import Redirect from './routes/Redirect.jsx';

const router = createBrowserRouter([
    {
        path: "/historial",
        element: <Historial />
    },
    {
        path: "/carga",
        element: <Carga />
    },
    {
        path: "/lista",
        element: <Lista />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "*",
        element: <Redirect />
    }
])

function Router() {
    return (
        <React.Fragment>
            <RouterProvider router={router} />
        </React.Fragment>
    )
};

export default Router