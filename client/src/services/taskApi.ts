import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const taskApi = createApi({
  reducerPath: 'taskapi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://a68ccf301d5e.ngrok-free.app/api/tasks',
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token && token !== 'undefined') headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<any[], void>({
      query: () => ({ url: '/tasks', method: 'GET', headers: {
        "ngrok-skip-browser-warning": "true"
      } }),
      providesTags: ['Task'],
    }),
    getTask: builder.query<any, string>({
      query: (id) => `/task/${id}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<any, any>({
      query: (body) => ({ url: '/create-task', method: 'POST', body }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<any, any>({
      query: ({ id, ...body }) => ({ url: `/update-task/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Task'],
    }),
    updateTaskStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/update-task-status/${id}`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Task'],
    }),
    assignTask: builder.mutation<any, { id: string; assignedToId: string }>({
      query: ({ id, assignedToId }) => ({ url: `/assign-task/${id}`, method: 'PUT', body: { assignedToId } }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/delete-task/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useAssignTaskMutation,
} = taskApi;


