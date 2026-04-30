import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Disciplines from './pages/Disciplines'
import Register from './pages/Register'
import Teams from './pages/Teams'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Results from './pages/Results'
import FAQ from './pages/FAQ'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111128',
              color: '#e2e8f0',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#00d4ff', secondary: '#000' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/disciplines" element={<Disciplines />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/faq" element={<FAQ />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
