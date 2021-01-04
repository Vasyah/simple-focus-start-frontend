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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path={'/'} render={() => <NewsPage/>}/>
          <Route path={'/signup'} render={() => <SignupPage/>}/>
          <Route path={'/login'} render={() => <LoginPage/>}/>
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
