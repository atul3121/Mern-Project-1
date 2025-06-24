import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import AppLayout from "./layout/AppLayout";
import axios from "axios";
import Register from "./pages/Register";

function App() {
  const [userDetails, setUserDetails] = useState(null);

  const updateUserDetails = (user) => {
    setUserDetails(user);
  };

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/auth/is-user-logged-in",
        {},
        { withCredentials: true }
      );
      updateUserDetails(response.data.user);
    } catch (error) {
      console.log("User not logged in or session expired.");
      setUserDetails(null);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Home />
            </AppLayout>
          )
        }
      />

      <Route
  path="/register"
  element={
    userDetails ? (
      <Navigate to="/dashboard" />
    ) : (
      <AppLayout>
        <Register />
      </AppLayout>
    )
  }
/>

      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Login updateUserDetails={updateUserDetails} />
            </AppLayout>
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/logout"
        element={
          userDetails ? (
            <Logout updateUserDetails={updateUserDetails} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/error"
        element={
          userDetails ? (
            <Error />
          ) : (
            <AppLayout>
              <Error />
            </AppLayout>
          )
        }
      />

      <Route
        path="*"
        element={
          <AppLayout>
            <Error />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
