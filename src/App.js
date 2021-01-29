// base
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './app.scss';
// components
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Header from "./components/Header/Header";
import Users from "./components/Users/Users";
// context
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalPopupProvider } from "./contexts/GlobalPopupContext";
import { VideoProvider } from "./contexts/VideoContext";
import { MessagesProvider } from "./contexts/MessagesContext";
// pages
import NewsPage from "./components/NewsPage/NewsPage";
import SignupPage from "./components/SignupPage/SignupPage";
import LoginPage from "./components/LoginPage/LoginPage";
import UpdateProfilePage from "./components/UpdateProfile/UpdateProfilePage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import VideoChatPage from "./components/VideoChatPage/VideoChatPage";
import GlobalPopup from "./components/GlobalPopup/GlobalPopup";
import StartListenServer from "./components/StartListenServer/StartListenServer";
import Loading from "./components/Loading/Loading";
import ChatPage from "./components/ChatPage/ChatPage";

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
                <PrivateRoute path={'/video'} render={() =>
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
