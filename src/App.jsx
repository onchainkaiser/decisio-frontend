import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import NewDecision from './pages/NewDecision'
import History from './pages/History'
import Analytics from './pages/Analytics'
import DecisionResult from './pages/DecisionResult'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><NewDecision /></PrivateRoute>} />
        <Route path="/result/:id" element={<PrivateRoute><DecisionResult /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}