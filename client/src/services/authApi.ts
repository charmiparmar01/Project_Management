import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: 'Admin' | 'Manager' | 'Employee' | string;
      isActive: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tidy-boxes-cover.loca.lt/api/users' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ message: string }, { username: string; email: string; password: string }>(
      {
        query: (body) => ({
          url: '/register',
          method: 'POST',
          body,
        }),
      }
    ),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;


