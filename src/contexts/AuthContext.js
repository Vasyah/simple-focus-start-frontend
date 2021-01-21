import React, { useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import firebase from 'firebase';
import { useHistory } from "react-router-dom";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // state
  const [ currentUserFull, setCurrentUserFull ] = useState();
  const [ currentUser, setCurrentUser ] = useState();
  const [ allUsers, setAllUsers ] = useState([]);
  // const [ loading, setLoading ] = useState(false); // мб потом использую
  // const [ loginAction, setLoginAction ] = useState(false);
  const [ logoutAction, setLogoutAction ] = useState(false);
  // other
  const history = useHistory();

  // login actions

  const signup = (email, password, name) => auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      let userId = auth.currentUser.uid
      firebase.database().ref(`users/${userId}`).set({
        name: name,
        email: email,
        online: true
      })
      history.push('/');
    })

  const login = (email, password) => auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('action login');
      history.push('/');
    });

  const loginHandler = (user) => {
    updateUser({
      id: user.uid,
      updates: {
        email: user.email,
        online: true
      }
    })
    getUser(user)
      .then(data => {
        setCurrentUser(data);
      })
      .finally(() => {});
    // getUsers();
    getUsers()
      .then(data => {
        setAllUsers(data);
      })
  }

  // getting promises

  const getUser = (user) => {
    if (!user) user = auth.currentUser;
    return firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
      let userDetails = snapshot.val();
      const updatedUser = {
        name: userDetails.name,
        email: userDetails.email,
        id: auth.currentUser.uid,
        online: userDetails.online
      }
      setCurrentUserFull(user);
      return Promise.resolve(updatedUser);
    });
  }

  const getUsers = () => {
    return firebase.database().ref('users').once('value').then(snapshot => {
      const userDetails = snapshot.val();
      const users = Object.entries(userDetails).map(([ key, user ]) => {
        return { ...user, id: key };
      });
      return Promise.all(users);
    });
  }

  // logout actions

  const logout = () => auth.signOut()
    .finally(() => {
      setLogoutAction(true)
    });

  const logoutHandler = () => {
    updateUser({
      id: currentUser.id,
      updates: {
        email: currentUser.email,
        online: false
      }
    })
    setCurrentUser();
    setAllUsers([]);
    setCurrentUserFull();
    setLogoutAction(false);
  }

  useEffect(() => {
    if (!logoutAction) return;
    console.log('user logout');
    logoutHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ logoutAction ]);

  // update actions

  const updateUser = (payload) => {
    if (payload.id) firebase.database().ref('users/' + payload.id)
      .update(payload.updates)
      .finally(() => {
        console.log('user updated');
      });
  }

  const updateEmail = (email) => currentUserFull
    .updateEmail(email)
    .finally(() => {
      loginHandler(auth.currentUser);
      console.log('email changed');
    });

  const updatePassword = (password) => currentUserFull
    .updatePassword(password)
    .finally(() => {
      loginHandler(auth.currentUser);
      console.log('password changed');
    });

  const resetPassword = (email) => auth.sendPasswordResetEmail(email);

  // state change watcher

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('auth state changed');
        loginHandler(user);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // playground

  useEffect(() => {
    // console.log('currentUser', currentUser);
  }, [ currentUser ]);

  useEffect(() => {
    // console.log('allUsers', allUsers);
  }, [ allUsers ]);

  // useEffect(() => {
  //   if (!loginAction) return;
  //   console.log('user login');
  //   loginHandler(auth.currentUser);
  // }, [loginAction]);

  //
  // useEffect(() => {
  //   // console.log('loginAction', loginAction);
  // }, [ loginAction ]);

  // const getUsersAdd = () => {
  //   let newAllUsers = allUsers;
  //   firebase.database().ref('users').on('child_added', snapshot => {
  //     const userDetails = snapshot.val();
  //     let id = snapshot.key;
  //     newAllUsers[id] = userDetails;
  //     setAllUsers(newAllUsers);
  //   });
  // }

  // const handleOnAuthStateChanged = () => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     setLoading(true);
  //     if (user) {
  //       firebase.database().ref('users/' + user.uid).once('value', snapshot => {
  //         let userDetails = snapshot.val();
  //         setCurrentUser({
  //           name: userDetails.name,
  //           email: userDetails.email,
  //           id: user.uid
  //         })
  //       })
  //       updateUser({
  //         id: user.uid,
  //         updates: {
  //           email: user.email,
  //           online: true
  //         }
  //       })
  //       getUsers();
  //     } else {
  //       console.log(currentUser);
  //       updateUser({
  //         id: currentUser.id,
  //         updates: {
  //           email: currentUser.email,
  //           online: false
  //         }
  //       })
  //       setAllUsers([]);
  //       setCurrentUser();
  //     }
  //     setLoading(false);
  //   });
  // }
  //

  // const getUser = () => {
  //   return new Promise((resolve) => {
  //     if (currentUser) {
  //       resolve(currentUser);
  //       console.log(currentUser);
  //     }
  //   })
  // }

  const value = {
    // state
    currentUser,
    allUsers,
    // login actions
    login,
    signup,
    // logout actions
    logout,
    // update actions
    resetPassword,
    updateEmail,
    updatePassword,
    // getting promises
    getUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
