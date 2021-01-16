import React, { useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import firebase from 'firebase';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [ currentUser, setCurrentUser ] = useState();
  const [ allUsers, setAllUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const signup = (email, password, name) => auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      let userId = firebase.auth().currentUser.uid
      firebase.database().ref(`users/${userId}`).set({
        name: name,
        email: email,
        online: true
      })
    }).catch(error => console.error('signup error', error));

  const login = (email, password) => auth.signInWithEmailAndPassword(email, password);

  const logout = () => auth.signOut();

  const resetPassword = (email) => auth.sendPasswordResetEmail(email);

  const updateEmail = (email) => currentUser.updateEmail(email);

  const updatePassword = (password) => currentUser.updatePassword(password);

  const updateUser = (payload) => {
    if (payload.userId) firebase.database().ref('users/' + payload.id).update(payload.updates);
  }

  const getUsers = () => {
    firebase.database().ref('users').on('child_added', snapshot => {
      const userDetails = snapshot.val();
      let id = snapshot.key;
      setAllUsers([...allUsers, { id, userDetails }]);
    });
    firebase.database().ref('users').on('child_changed', snapshot => {
      const userDetails = snapshot.val();
      let id = snapshot.key;
      updateUser({ id, userDetails });
    });
  }

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        // firebase.database().ref('users/' + user.uid).once('value', snapshot => {
        //   let userDetails = snapshot.val();
        //   setCurrentUser({
        //     name: userDetails.name,
        //     email: userDetails.email,
        //     userId: user.uid
        //   })
        // })

        // updateUser({
        //   id: user.uid,
        //   updates: {
        //     email: user.email,
        //     online: true
        //   }
        // })
        // getUsers();
      } else {
        // updateUser({
        //   id: currentUser.id,
        //   updates: {
        //     email: currentUser.email,
        //     online: false
        //   }
        // })
        setCurrentUser();
      }
      // setAllUsers([])
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
