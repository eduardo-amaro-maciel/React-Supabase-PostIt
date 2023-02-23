import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import PrivateRoute from './PrivateRoute'

function RoutesApp() {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} exact />
                </Route>
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default RoutesApp