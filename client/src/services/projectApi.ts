import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const projectApi = createApi({
  reducerPath: 'projectapi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://a68ccf301d5e.ngrok-free.app/api/projects',
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token && token !== 'undefined') headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<any[], void>({
      query: () => '/projects',
      providesTags: ['Project'],
    }),
    getProject: builder.query<any, string>({
      query: (id) => `/project/${id}`,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<any, any>({
      query: (body) => ({ url: '/create-project', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<any, any>({
      query: ({ id, ...body }) => ({ url: `/update-project/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/delete-project/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
    assignProjectMember: builder.mutation<any, { id: string; userId: string }>({
      query: ({ id, userId }) => ({ url: `/assign-project-member/${id}`, method: 'POST', body: { userId } }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAssignProjectMemberMutation,
} = projectApi;


