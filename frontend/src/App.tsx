import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Booking from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import MyBookings from "./pages/MyBookings";

const SignInPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  return (
    <SignIn
      onSuccess={() => navigate('/')}
      onCreateAccount={() => navigate('/signup')}
      onResetPassword={() => navigate('/forgot-password')}
      onNavigateHome={() => navigate('/')}
      onUserChange={setUser}
    />
  );
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext()
  return (
    <SignUp
    onSuccess={() => navigate('/')}
    onSignIn={() => navigate('/signin')}
    onNavigateHome={() => navigate('/')}
    onUserChange={setUser}     
    />
  );
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  return (
    <ForgotPassword
      onBackToSignIn={() => navigate('/signin')}
      onNavigateHome={() => navigate('/')}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/booking/:serviceId' element={<Booking />} />
        <Route path='/payment/:bookingId' element={<PaymentPage />} />
        <Route path='/bookings'           element={<MyBookings />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
