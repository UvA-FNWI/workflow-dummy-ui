import {endpoints} from "backend/endpoints.ts";
import type {QuestionContext} from "backend/types.ts";
import {ChoiceInputControl} from "components/InputControl/ChoiceInputControl.tsx";

interface Props {
  value: string | null | undefined
  onInput: (value: string) => void;
  workflowDefinition: string
  context: QuestionContext
}

export const InstanceDropdown = ({ value, onInput, context }: Props) =>
{
  const { data } = endpoints.getChoices.useQuery({
    instanceId: context.instanceId,
    submissionId: context.submissionId,
    questionName: context.question.name
  })

  return <ChoiceInputControl choices={data ?? []} question={context.question} value={value} onChange={onInput} />
}