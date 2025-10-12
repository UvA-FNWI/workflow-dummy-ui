import {Select} from "antd";

interface Props {
  value: string | null | undefined
  onInput: (value: string) => void;
  entityType: string
}

export const InstanceDropdown = ({ value, onInput, entityType }: Props) =>
{
  console.log("TODO: get instances", entityType);

  return <Select value={value}
                 options={[]}
                 onSelect={v => onInput(v)} />
}