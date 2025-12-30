import type {ActionType} from "backend/types.ts";

export type GetInstancesParams = {
  workflowDefinition: string
}

export type GetInstanceParams = {
  id: string
}

export type GetMessagesParams = {
  instanceId: string
}

export type GetSubmissionParams = {
  instanceId: string
  submissionId: string
}

export type GetScreenParams = {
  workflowDefinition: string
  screen: string
}

export type SaveAnswerParams = {
  instanceId: string
  submissionId: string
  answer: AnswerInput
}

export type AnswerInput = {
  questionName: string
  value: unknown
}

export type FindParams = {
  query: string
}

export type SaveFileParams = {
  instanceId: string
  submissionId: string
  questionName: string
  file: File
}

export type GetChoicesParams = {
  instanceId: string
  submissionId: string
  questionName: string
}

export type DeleteFileParams = {
  instanceId: string
  submissionId: string
  questionName: string
  fileId: string
}

export type AddMessageParams = {
  instanceId: string
  questionName?: string
  body?: string
  replyToId?: string | null
  kind?: MessageKind
}

export type FileParams = {
  questionName: string
  file?: File | null
  deleteFileId?: string | null
}

export type ExecuteActionParams = {
  instanceId: string
  type: ActionType
  name: string
}

export type UndoEventParams = {
  instanceId: string
  eventName: string
}

export type MessageKind = "Message" | "Close";