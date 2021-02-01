// base
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.scss';
// components
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Header from "./components/Header/Header";
import GlobalPopup from "./components/GlobalPopup/GlobalPopup";
import Users from "./components/Users/Users";
import StartListenServer from "./components/StartListenServer/StartListenServer";
// context
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalPopupProvider } from "./contexts/GlobalPopupContext";
import { VideoProvider } from "./contexts/VideoContext";
import { MessagesProvider } from "./contexts/MessagesContext";
// pages
import ChatPage from "./pages/ChatPage/ChatPage";
import VideoChatPage from "./pages/VideoChatPage/VideoChatPage";
import UpdateProfilePage from "./pages/UpdateProfilePage/UpdateProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <VideoProvider>
          <MessagesProvider>
            <GlobalPopupProvider>
              <Header/>
              <GlobalPopup/>
              <StartListenServer/>
              <Switch>
                <PrivateRoute exact path={'/'} render={() => (
                  <div className={'container'}>
                    <div className={'flex-container'}>
                      <div className={'flex-item-left'}><Users/></div>
                      <div className={'flex-item-middle'}><NewsPage/></div>
                    </div>
                  </div>
                )}/>
                <PrivateRoute path={'/update-profile'} render={() => (
                    <UpdateProfilePage/>
                )}/>
                <PrivateRoute path={'/video/:id'} render={() =>
                    <VideoChatPage/>
                }/>
                <PrivateRoute path={'/chat/:id'} render={() => (
                  <div className={'container'}>
                    <div className={'flex-container'}>
                      <div className={'flex-item-left'}><Users/></div>
                      <div className={'flex-item-middle'}><ChatPage/></div>
                    </div>
                  </div>
                )}/>
                <Route path={'/signup'} component={SignupPage}/>
                <Route path={'/login'} component={LoginPage}/>
                <Route path={'/forgot-password'} component={ForgotPasswordPage}/>
              </Switch>
            </GlobalPopupProvider>
          </MessagesProvider>
        </VideoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
