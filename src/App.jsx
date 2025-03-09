import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'
import Login from './components/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Todolist from './components/Todolist'


function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>

          <Routes>
          <Route
          path="/login"
          element={<Login></Login>} 
          />
          <Route
          path="/todolist"
          element={
            <ProtectedRoute>
              <Todolist></Todolist>
            </ProtectedRoute>
          } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;
