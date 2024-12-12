"use client";

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from './Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Home from './Subpages/Home/app';
import Login from './Subpages/Login/app';
import Register from './Subpages/Register';
import Cart from './Subpages/Cart/app';
import Admin from './Subpages/Admin/app';
import Navbar from './Components/NavBar/app';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        {isAdmin ? (
          <Route path="/admin" element={<Admin />} />
        ) : (
          <Route path="/admin" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;