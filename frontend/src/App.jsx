import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import EventDetail from './pages/EventDetail'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {
  const [token, setToken] = useState(null)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Auth pages — no navbar/footer */}
          <Route path="/signin" element={<SignIn onLogin={setToken} />} />
          <Route path="/signup" element={<SignUp onLogin={setToken} />} />

          {/* Main pages — with navbar/footer */}
          <Route path="*" element={
            <>
              <Navbar token={token} onSignOut={() => setToken(null)} />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/event/:id" element={<EventDetail token={token} />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
