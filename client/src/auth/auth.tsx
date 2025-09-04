import { useState } from 'react';

export default function useToken() {
  const getAccessToken = () => {
    const tokenString = sessionStorage.getItem('accessToken');
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken?.accessToken;
  };

  const getRefreshToken = () => {
    const tokenString = sessionStorage.getItem('refreshToken');
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken?.refreshToken;
  };

  const [accessToken, setAccessToken] = useState<string | undefined>(getAccessToken());
  const [refreshToken, setRefreshToken] = useState<string | undefined>(getRefreshToken());

  const saveToken = (userToken: { accessToken: string; refreshToken: string }) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setAccessToken(userToken.accessToken);
    setRefreshToken(userToken.refreshToken);
  };

  return {
    setToken: saveToken,
    accessToken,
    refreshToken,
  };
}


