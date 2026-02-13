import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AddBirthday from './pages/AddBirthday';
import BirthdayDetails from './pages/BirthdayDetails';
import LandingPage from './pages/LandingPage';
import Welcome from './pages/Welcome';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LoadingScreen from './components/LoadingScreen';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    if (loading) return <LoadingScreen />;

    return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    if (loading) return <LoadingScreen />;

    return !token ? children : <Navigate to="/dashboard" />;
};

// Component to handle Conditional Navbar
const ConditionalNavbar = () => {
    const location = useLocation();
    // Hide Navbar on Login, Register, Welcome, Loading, Add Birthday, and Birthday Details, Forgot Password, Reset Password, Admin
    const hideOnRoutes = ['/login', '/register', '/welcome', '/loading', '/add-birthday', '/forgot-password', '/admin'];
    const isBirthdayDetails = location.pathname.startsWith('/birthday/') || location.pathname.startsWith('/reset-password/');

    if (hideOnRoutes.includes(location.pathname) || isBirthdayDetails) {
        return null; // Don't show Navbar
    }

    return <Navbar />;
};

// Component to handle Conditional Footer
const ConditionalFooter = () => {
    const location = useLocation();
    // Hide Footer on Login, Register, Welcome, Loading, Add Birthday, and Birthday Details, Forgot Password, Reset Password, Admin
    const hideOnRoutes = ['/login', '/register', '/welcome', '/loading', '/add-birthday', '/forgot-password', '/admin'];
    const isBirthdayDetails = location.pathname.startsWith('/birthday/') || location.pathname.startsWith('/reset-password/');

    if (hideOnRoutes.includes(location.pathname) || isBirthdayDetails) {
        return null; // Don't show Footer
    }

    return <Footer />;
};

// ScrollToTop component to reset scroll on navigation
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const MainContent = () => {
    const location = useLocation();
    const [isNavigating, setIsNavigating] = useState(false);
    // Only show Welcome screen if we are on the root path '/' on initial load
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Show welcome only on the first visit to '/'
        if (location.pathname === '/') {
            setShowWelcome(true);
        }
    }, []);

    // Handle global loading state on navigation
    useEffect(() => {
        setIsNavigating(true);
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 500); // Brief loading show

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const handleWelcomeComplete = () => {
        setShowWelcome(false);
    };

    if (showWelcome) {
        return <Welcome onContinue={handleWelcomeComplete} />;
    }

    const pageVariants = {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 10 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.4
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <ScrollToTop />
            <AnimatePresence mode="wait">
                {isNavigating && <LoadingScreen key="loading" />}
            </AnimatePresence>

            <ConditionalNavbar />

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={
                        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                            <LandingPage />
                        </motion.div>
                    } />
                    <Route path="/welcome" element={
                        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                            <Welcome />
                        </motion.div>
                    } />
                    <Route path="/landing" element={
                        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                            <LandingPage />
                        </motion.div>
                    } />
                    <Route path="/login" element={
                        <PublicRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <Login />
                            </motion.div>
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <Register />
                            </motion.div>
                        </PublicRoute>
                    } />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <Dashboard />
                            </motion.div>
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <Profile />
                            </motion.div>
                        </PrivateRoute>
                    } />
                    <Route path="/forgot-password" element={
                        <PublicRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <ForgotPassword />
                            </motion.div>
                        </PublicRoute>
                    } />
                    <Route path="/reset-password/:resetToken" element={
                        <PublicRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <ResetPassword />
                            </motion.div>
                        </PublicRoute>
                    } />
                    <Route path="/admin" element={
                        <PrivateRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <AdminDashboard />
                            </motion.div>
                        </PrivateRoute>
                    } />
                    <Route path="/add-birthday" element={
                        <PrivateRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <AddBirthday />
                            </motion.div>
                        </PrivateRoute>
                    } />
                    <Route path="/birthday/:id" element={
                        <PrivateRoute>
                            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                                <BirthdayDetails />
                            </motion.div>
                        </PrivateRoute>
                    } />
                    {/* TEST ROUTE - Remove later */}
                    <Route path="/loading" element={
                        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                            <LoadingScreen />
                        </motion.div>
                    } />
                </Routes>
            </AnimatePresence>
            <ConditionalFooter />
        </div>
    );
};

function App() {
    // Global Dark Mode Effect - Reads from localStorage on initial load
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            const { darkMode } = JSON.parse(savedSettings);
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    return (
        <AuthProvider>
            <Router>
                <MainContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
