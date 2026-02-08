import type {ActionType, Answer, Submission, WorkflowInstance} from "backend/types.ts";
import type {LocalString} from "hooks/useTranslate.ts";

export type SaveAnswerPayload = {
  answers: Answer[]
  submission: Submission
}

export type ExecuteActionPayload = {
  type: ActionType
  instance?: WorkflowInstance
  result: EffectResult
}

export type SubmitSubmissionPayload = {
  submission: Submission
  updatedInstance?: WorkflowInstance
  validationErrors: ValidationError[]
  effectResult?: EffectResult
}

export type ValidationError = {
  questionName: LocalString,
  validationMessage: LocalString
}

export type EffectResult = {
  redirectUrl?: string
}