import type {Answer, Submission, WorkflowInstance} from "backend/types.ts";
import type {LocalString} from "hooks/useTranslate.ts";

export type SaveAnswerPayload = {
  answers: Answer[]
  submission: Submission
}

export type SubmitSubmissionPayload = {
  submission: Submission
  updatedInstance?: WorkflowInstance
  invalidQuestions: InvalidQuestion[]
}

export type InvalidQuestion = {
  questionName: LocalString,
  validationError: LocalString
}