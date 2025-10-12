import type {Answer, Submission} from "backend/types.ts";
import type {LocalString} from "hooks/useTranslate.ts";

export type SaveAnswerPayload = {
  answers: Answer[]
  submission: Submission
}

export type SubmitSubmissionPayload = {
  submission: Submission
  invalidQuestions: InvalidQuestion[]
}

export type InvalidQuestion = {
  questionName: LocalString,
  validationError: LocalString
}