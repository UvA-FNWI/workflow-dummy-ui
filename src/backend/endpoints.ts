import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {
  WorkflowDefinition,
  Screen,
  Submission,
  User,
  WorkflowInstance,
  Message,
  LinkInfo,
  Choice
} from "backend/types.ts";
import type {
  AddMessageParams,
  DeleteFileParams, ExecuteActionParams,
  FindParams, GetChoicesParams,
  GetInstanceParams,
  GetInstancesParams, GetMessagesParams,
  GetScreenParams,
  GetSubmissionParams,
  SaveAnswerParams, SaveFileParams, UndoEventParams
} from "backend/params.ts";
import type {ExecuteActionPayload, SaveAnswerPayload, SubmitSubmissionPayload} from "backend/payloads.ts";
import {endpoint} from "env.ts";
import {getAccessToken} from "auth.tsx";

const params = new URLSearchParams(window.location.search);
export const backendConfig = {
  version: params.get("version") ?? "",
  endpoint: params.get("api") ?? endpoint
}

export const backendSlice = createApi({
  reducerPath: 'api',
  tagTypes: ["WorkflowInstance", "AnswerChoices"],
  baseQuery: fetchBaseQuery({
    baseUrl: backendConfig.endpoint,
    headers: {
      "Workflow-Version": backendConfig.version
    },
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
  }),
  endpoints: (build) => ({
    getWorkflowDefinitions: build.query<WorkflowDefinition[], unknown>({
      query: () => 'WorkflowDefinitions'
    }),
    getInstance: build.query<WorkflowInstance, GetInstanceParams>({
      query: (params) => `WorkflowInstances/${params.id}`,
      providesTags: ["WorkflowInstance"]
    }),
    getInstances: build.query<WorkflowInstance[], GetInstancesParams>({
      query: (params) => `WorkflowInstances/instances/${params.workflowDefinition}`
    }),
    getSubmission: build.query<Submission, GetSubmissionParams>({
      query: (params) => `Submissions/${params.instanceId}/${params.submissionId}`
    }),
    getScreen: build.query<Screen, GetScreenParams>({
      query: (params) => `Screens/${params.workflowDefinition}/${params.screen}`
    }),
    undoEvent: build.mutation<void, UndoEventParams>({
      query: (params) => ({
        url: `/WorkflowInstances/${params.instanceId}/Events/${params.eventName}`,
        method: 'delete'
      }),
      invalidatesTags: ["WorkflowInstance"]
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
      },
      invalidatesTags: (res, _, params) => res?.answers
        .filter(a => a.questionName !== params.answer.questionName)
        .map(a => ({ type: "AnswerChoices", id: a.questionName })) ?? []
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
    executeAction: build.mutation<ExecuteActionPayload, ExecuteActionParams>({
      query: (params) => ({
        url: "Actions",
        method: "post",
        body: params
      })
    }),
    getChoices: build.query<Choice[], GetChoicesParams>({
      query: (params) => `Answers/${params.instanceId}/${params.submissionId}/${params.questionName}/Choices`,
      providesTags: (_, __, arg) => [{ type: "AnswerChoices", id: arg.questionName }]
    }),
    getCurrentChoices: build.query<Choice[], GetChoicesParams>({
      query: (params) => `Answers/${params.instanceId}/${params.submissionId}/${params.questionName}/CurrentChoices`,
    }),
    getPdfLinks: build.query<LinkInfo, GetMessagesParams>({
      query: (params) => `Pdf/${params.instanceId}`
    }),
    getMessages: build.query<Message[], GetMessagesParams>({
      query: (params) => `Messages/${params.instanceId}`
    }),
    addMessage: build.mutation<Message, AddMessageParams>({
      query: (params) => ({
        url: `Messages/${params.instanceId}`,
        method: 'post',
        body: params
      }),
      async onQueryStarted(params, {dispatch, queryFulfilled}) {
        const {data} = await queryFulfilled;
        dispatch(
          backendSlice.util.updateQueryData(
            "getMessages",
            {instanceId: params.instanceId},
            (current) => {
              const index = current.findIndex(m => m.id === data.id);
              if (index >= 0) {
                current.splice(index, 1, data);
              } else {
                current.push(data);
              }
            }
          )
        )
      }
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