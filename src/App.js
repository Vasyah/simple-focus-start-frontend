// base
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.scss';
// pages
import NewsPage from "./components/NewsPage/NewsPage";
import SignupPage from "./components/SignupPage/SignupPage";
import LoginPage from "./components/LoginPage/LoginPage";
import UpdateProfilePage from "./components/UpdateProfile/UpdateProfilePage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import Header from "./components/Header/Header";
// other
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Switch>
          <PrivateRoute exact path={'/'} component={NewsPage}/>
          <PrivateRoute path={'/update-profile'} component={UpdateProfilePage}/>
          <Route path={'/signup'} component={SignupPage}/>
          <Route path={'/login'} component={LoginPage}/>
          <Route path={'/forgot-password'} component={ForgotPasswordPage}/>
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
