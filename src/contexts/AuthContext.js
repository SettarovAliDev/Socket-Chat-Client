import React, { useContext, useState, useEffect } from "react";

import AuthService from "../services/AuthService";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);
  
  async function loadUser() {
    const response = await AuthService.loadUser();
    !response.errors && setCurrentUser(response);
    setLoading(false);
  }

  const createUser = async (user) => {
    const response = await AuthService.createUser(user);
    !response.errors && (await loadUser());
    return response;
  };

  const loginUser = async (secretKey) => {
    const response = await AuthService.loginUser(secretKey);
    !response.errors && (await loadUser());
    return response;
  };

  const checkEmail = (email) => {
    return AuthService.checkEmail(email);
  };

  const loginAuthorization = ({ email, password }) => {
    return AuthService.loginAuthorization({ email, password });
  };

  const logout = () => {
    setCurrentUser(null);
    AuthService.logout();
  };

  const value = {
    currentUser,
    checkEmail,
    loginAuthorization,
    createUser,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
