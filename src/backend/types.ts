import type {LocalString} from "hooks/useTranslate.ts";

export type EntityType = {
  name: string
  titlePlural: LocalString
  title: LocalString
  screens?: string[]
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
  name: string;
  id: string
  type: ActionType
  form?: string
  title: LocalString
  mail?: string
}

export type Screen = {
  name: string
  entityType: EntityType
  columns: ScreenColumn[]
  rows: ScreenRow[]
}
export type FilterType = "None" | "Pick";
export type DisplayType = "Normal" | "ExportOnly";
export type SortDirection = "Ascending" | "Descending";

export type ScreenColumn = {
  id: number
  title: LocalString
  property: string | null
  filterType: FilterType
  displayType: DisplayType
  defaultSort?: SortDirection
  link: boolean
  dataType: DataType
}
export type ScreenRow = {
  id: string
  values: Record<number, unknown>
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
  entityType?: string
  hideInResults: boolean;
  shortText?: LocalString;
  layout?: StringLayoutOptions | ChoiceLayoutOptions;
}

export type StringLayoutOptions = {
  allowAttachments: boolean;
  multiline: boolean
}

export type ChoiceLayoutOptions = {
  type: ChoiceLayoutType
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
export type ChoiceLayoutType = "Dropdown" | "RadioList";