import type {LocalString} from "hooks/useTranslate.ts";

export type EntityType = {
  name: string
  titlePlural: LocalString
  title: LocalString
}

export type WorkflowInstance = {
  id: string
  title: string
  entityType: EntityType
  actions: Action[]
  submissions: Submission[]
  permissions: RoleAction[]
  fields: Field[]
  steps: Step[]
}

export type Step = {
  id: string;
  event?: string | null;
  title: LocalString;
  dateCompleted?: string;
  children?: Step[] | null;
}

export type Field = {
  label: LocalString
  value: unknown
}

export type User = {
  id: string
  email: string
  displayName: string
}

export type Answer = {
  id: string;
  questionName: string
  value: unknown
  isVisible: boolean
  validationError?: LocalString
  visibleChoices?: string[]
  files: StoredFile[]
}

export type StoredFile = {
  id: string
  name: string
  accessToken: string
}

export type Action = {
  id: string
  type: ActionType
  form?: string
  title: LocalString
  mail?: string
}

export type Submission = {
  id: string
  dateSubmitted?: string
  permissions: RoleAction[]
  answers: Answer[]
  form: Form
}

export type Form = {
  name: string
  title: LocalString
  pages: Page[]
}

export type Page = {
  index: number
  title: LocalString
  introduction?: LocalString
  layout: PageLayout
  questions: Question[]
}

export type Question = {
  name: string
  type: DataType
  text: LocalString
  description?: LocalString
  isRequired: boolean
  isArray: boolean
  choices: Choice[]
  multiline: boolean
  layout: QuestionLayout
  entityType?: string
  hideInResults: boolean;
  shortText?: LocalString;
}

export type Choice = {
  name: string
  description?: LocalString
  text: LocalString
}

export type PageLayout = "Normal" | "Condensed";
export type ActionType = "SubmitForm" | "Execute";
export type RoleAction = "ViewAdminTools" | "View" | "Edit" | "Submit";
export type DataType = "File" | "Date" | "DateTime" | "User" | "Choice" | "Currency" | "Table" | "String" | "Double" | "Reference" | "Int";
export type QuestionLayout = "RadioList";