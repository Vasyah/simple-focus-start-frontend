// base
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.scss';

// pages
import NewsPage from "./components/NewsPage/NewsPage";
import SignupPage from "./components/SignupPage/SignupPage";
import LoginPage from "./components/LoginPage/LoginPage";

// other
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path={'/'} component={NewsPage}/>
          <Route path={'/signup'} component={SignupPage}/>
          <Route path={'/login'} component={LoginPage}/>
          <Route path={'/forgot-password'} component={ForgotPasswordPage}/>
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
