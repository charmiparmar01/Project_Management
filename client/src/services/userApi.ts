import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../models/types';

export const userApi = createApi({
  reducerPath: 'userapi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/users',
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token && token !== 'undefined') headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<any, void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUser: builder.query<any, string>({
      query: (id) => `/user/${id}`,
      providesTags: ['User'],
    }),
    addUser: builder.mutation<User, Omit<User, 'id'>>({
      query: (newUser) => ({
        url: '/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, any>({
      query: ({ id, ...updatedUser }) => ({
        url: `/update-user/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: ['User'],
    }),
    assignRole: builder.mutation<void, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/assign-role/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/delete-user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useAssignRoleMutation,
  useDeleteUserMutation,
} = userApi;


