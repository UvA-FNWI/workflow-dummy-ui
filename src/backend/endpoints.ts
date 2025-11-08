import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {EntityType, Screen, Submission, User, WorkflowInstance} from "backend/types.ts";
import type {
  DeleteFileParams, ExecuteActionParams,
  FindParams,
  GetInstanceParams,
  GetInstancesParams,
  GetScreenParams,
  GetSubmissionParams,
  SaveAnswerParams, SaveFileParams
} from "backend/params.ts";
import type {SaveAnswerPayload, SubmitSubmissionPayload} from "backend/payloads.ts";
import {endpoint} from "env.ts";

const params = new URLSearchParams(window.location.search);
export const backendConfig = {
  version: params.get("version") ?? "",
  endpoint: params.get("api") ?? endpoint
}

export const backendSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: backendConfig.endpoint,
    headers: {
      "Workflow-Version": backendConfig.version
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
    getScreen: build.query<Screen, GetScreenParams>({
      query: (params) => `Screens/${params.entityType}/${params.screen}`
    }),
    submitSubmission: build.mutation<SubmitSubmissionPayload, GetSubmissionParams>({
      query: (params) => ({
        url: `Submissions/${params.instanceId}/${params.submissionId}`,
        method: 'post'
      }),
      async onQueryStarted(params, {dispatch, queryFulfilled}) {
        const {data} = await queryFulfilled;
        dispatch(
          backendSlice.util.updateQueryData(
            "getInstance",
            {id: params.instanceId},
            () => data.updatedInstance,
          ),
        );
        dispatch(
          backendSlice.util.updateQueryData(
            "getSubmission",
            {instanceId: params.instanceId, submissionId: params.submissionId},
            () => data.submission,
          ),
        );
      },
    }),
    saveAnswer: build.mutation<SaveAnswerPayload, SaveAnswerParams>({
      query: (params) => ({
        url: `Answers/${params.instanceId}/${params.submissionId}/${params.answer.questionName}`,
        method: 'post',
        body: params.answer
      }),
      async onQueryStarted(params, {dispatch, queryFulfilled}) {
        const {data} = await queryFulfilled;
        dispatch(
          backendSlice.util.updateQueryData(
            "getSubmission",
            {instanceId: params.instanceId, submissionId: params.submissionId},
            (current) => {
              current.answers = current.answers.map(oldAnswer => {
                const newAnswer = data.answers.filter(a => a.id === oldAnswer.id)[0];
                return newAnswer ?? oldAnswer;
              });
            }
          )
        )
      }
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
    saveFile: build.mutation<void, SaveFileParams>({
      query: (params) => ({
        url: `Answers/${params.instanceId}/${params.submissionId}/${params.questionName}/artifacts`,
        method: "post",
        body: toFormData(params.file),
        formData: true,
      }),
    }),
    deleteFile: build.mutation<void, DeleteFileParams>({
      query: (params) => ({
        url: `Answers/${params.instanceId}/${params.submissionId}/${params.questionName}/artifacts/${params.fileId}`,
        method: "delete"
      }),
    }),
    executeAction: build.mutation<void, ExecuteActionParams>({
      query: (params) => ({
        url: "Actions",
        method: "post",
        body: params
      })
    })
  })
});

const toFormData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const {endpoints} = backendSlice;

type Options = { skip: boolean }
type QueryResult<T> = {
  data?: T[],
  isLoading: boolean,
}
export type QueryType<T> = {
  useQuery: (params: FindParams, options: Options) => QueryResult<T>
}