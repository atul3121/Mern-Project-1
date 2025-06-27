import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

import AppLayout from "./layout/AppLayout";
import UserLayout from "./layout/UserLayout";

import Home from "./pages/Home";
import Login from "./Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Logout from "./pages/Logout";

import { serverEndpoint } from "./config/config";
import { SET_USER } from "./redux/user/actions";

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    axios
      .get(`${serverEndpoint}/auth/profile`, { withCredentials: true })
      .then((res) => dispatch({ type: SET_USER, payload: res.data.user }))
      .catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        userDetails ? <UserLayout><Navigate to="/dashboard" /></UserLayout> :
        <AppLayout><Home /></AppLayout>
      } />

      <Route path="/login" element={
        userDetails ? <UserLayout><Dashboard /></UserLayout> :
        <AppLayout><Login /></AppLayout>
      } />

      <Route path="/register" element={
        userDetails ? <Navigate to='/dashboard' /> :
        <AppLayout><Register /></AppLayout>
      } />

      <Route path="/dashboard" element={userDetails ? <Dashboard /> : <Navigate to="/login" />} />

      <Route path="/logout" element={
        userDetails ? <Logout /> : <Navigate to="/login" />
      } />

      <Route path="/error" element={
        userDetails ? <UserLayout><Error /></UserLayout> :
        <AppLayout><Error /></AppLayout>
      } />
    </Routes>
  );
}

export default App;
