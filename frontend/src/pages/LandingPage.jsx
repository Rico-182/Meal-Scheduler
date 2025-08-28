import React from 'react'
import { CalendarDays, Lock, MapPin, MailCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const LoginPage = ({auth}) => {
    const navigate = useNavigate();
    const handleLogin = () => {
        if (auth) {
          navigate('/dashboard');
        }
        else {
          window.location.href = 'http://localhost:5001/api/auth/google';
        }
        
      };
    
      return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center max-w-6xl w-full gap-12">
          {/* Left side: text content */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-base-content">
              A faster way to schedule meals.
            </h1>
  
            <ul className="space-y-2 text-base-content/70 text-md">
              <li className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-base-content" />
                Checks for free meal times using GCal
              </li>
              <li className="flex items-center gap-2">
                <MailCheck className="w-5 h-5 text-base-content" />
                Automatically creates GCal invites
              </li>
              {/* <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-base-content" />
                Vote on a preferred campus meeting place
              </li> */}
            </ul>
  
            <div className="flex gap-4 mt-4 justify-center lg:justify-start">
              <button onClick={handleLogin} className="btn btn-primary">
                Schedule a meal
              </button>
              <button className="btn btn-outline">How to use?</button>
            </div>
          </div>
  
          {/* Right side: optional image placeholder */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-60 h-60 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg flex items-center justify-center text-white text-xl font-bold">
              📅
            </div>
          </div>
        </div>
      </div>
    );
}

export default LoginPage