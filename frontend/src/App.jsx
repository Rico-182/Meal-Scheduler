import React from 'react'
import './index.css'
import LandingPage from './pages/LandingPage'
import MealRequestForm from './pages/MealRequestForm';
import SchedulePage from './pages/SchedulePage';
import {Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import {Toaster} from 'react-hot-toast';
import { Loader } from 'lucide-react';
import SignInRedirect from './pages/SignInRedirect';


const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
  );

  return (
    <div>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<LandingPage auth={authUser}/>} />
        <Route path="/dashboard" element={authUser ? <MealRequestForm /> : <SignInRedirect/>} />
        <Route path="/schedule/:id" element={authUser? <SchedulePage /> : <SignInRedirect/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App