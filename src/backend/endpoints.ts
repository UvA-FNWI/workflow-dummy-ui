import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {EntityType, Submission, User, WorkflowInstance} from "backend/types.ts";
import type {
  FindParams,
  GetInstanceParams,
  GetInstancesParams,
  GetSubmissionParams,
  SaveAnswerParams
} from "backend/params.ts";
import type {SaveAnswerPayload, SubmitSubmissionPayload} from "backend/payloads.ts";
import {endpoint} from "env.ts";

export const backendSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: new URLSearchParams(window.location.search).get("api") ?? endpoint,
    headers: {
      "Workflow-Version": new URLSearchParams(window.location.search).get("version") ?? ""
    }
  }),
  endpoints: (build) => ({
    getEntityTypes: build.query<EntityType[], unknown>({
      query: () => 'EntityTypes'
    }),
    getInstance: build.query<WorkflowInstance, GetInstanceParams>({
      query: (params) => `WorkflowInstances/${params.id}`
    }),
    getInstances: build.query<WorkflowInstance[], GetInstancesParams>({
      query: (params) => `WorkflowInstances/instances/${params.entityType}`
    }),
    getSubmission: build.query<Submission, GetSubmissionParams>({
      query: (params) => `Submissions/${params.instanceId}/${params.submissionId}`
    }),
    submitSubmission: build.mutation<SubmitSubmissionPayload, GetSubmissionParams>({
      query: (params) => ({
        url: `Submissions/${params.instanceId}/${params.submissionId}`,
        method: 'post'
      })
    }),
    saveAnswer: build.mutation<SaveAnswerPayload, SaveAnswerParams>({
      query: (params) => ({
        url: `Submissions/${params.instanceId}/${params.submissionId}`,
        method: 'patch',
        body: params.answer
      })
    }),
    createInstance: build.mutation<WorkflowInstance, GetInstancesParams>({
      query: (body) => ({
        url: 'WorkflowInstances',
        method: 'post',
        body
      })
    }),
    findUsers: build.query<User[], FindParams>({
      query: (params) => ({
        url: `Users/find`,
        params
      })
    }),
  })
});

export const {endpoints} = backendSlice;

type Options = { skip: boolean }
type QueryResult<T> = {
  data?: T[],
  isLoading: boolean,
}
export type QueryType<T> = {
  useQuery: (params: FindParams, options: Options) => QueryResult<T>
}