export type GetInstancesParams = {
  entityType: string
}

export type GetInstanceParams = {
  id: string
}

export type GetSubmissionParams = {
  instanceId: string
  submissionId: string
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

export type DeleteFileParams = {
  instanceId: string
  submissionId: string
  questionName: string
  fileId: string
}

export type FileParams = {
  questionName: string
  file?: File | null
  deleteFileId?: string | null
}