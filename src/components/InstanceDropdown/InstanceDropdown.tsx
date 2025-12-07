import {Select} from "antd";

interface Props {
  value: string | null | undefined
  onInput: (value: string) => void;
  workflowDefinition: string
}

export const InstanceDropdown = ({ value, onInput, workflowDefinition }: Props) =>
{
  console.log("TODO: get instances", workflowDefinition);

  return <Select value={value}
                 options={[]}
                 onSelect={v => onInput(v)} />
}