import {Checkbox, Radio, Select, Space} from "antd";
import type {Choice, ChoiceLayoutOptions, Question} from "backend/types.ts";
import {TooltipText} from "components/TooltipText/TooltipText.tsx";
import {useTranslate} from "hooks/useTranslate.ts";

interface Props {
  choices: Choice[]
  question: Question
  value: unknown
  onChange: (value: unknown) => void
}

export const ChoiceInputControl = ({ question, value, onChange, choices } : Props) => {
  const { l } = useTranslate();

  const useRadioList = (question.layout as ChoiceLayoutOptions)?.type === "RadioList";
  const options = choices?.map(c => ({ value: c.name, label: l(c.text) })) ?? [];

  if (useRadioList && question.isArray)
    return <Checkbox.Group onChange={onChange}
                           value={value as unknown[]}>
      <Space direction="vertical">
        {choices?.map(o => <Checkbox key={o.name} value={o.name}><TooltipText text={o.text}
                                                                              description={o.description}/></Checkbox>)}
      </Space>
    </Checkbox.Group>
  else if (useRadioList)
    return <Radio.Group onChange={v => onChange(v.target.value)}
                        value={value as string}>
      <Space direction="vertical">
        {choices?.map(o => <Radio key={o.name} value={o.name}><TooltipText text={o.text}
                                                                           description={o.description}/></Radio>)}
      </Space>
    </Radio.Group>

  if (question.isArray)
    return <Select value={value as string[]}
                   onChange={(v: string[]) => onChange(v)}
                   mode={"multiple"}
                   showSearch={options?.length > 10}
                   filterOption={(input, option) =>
                     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                   }
                   style={{color: "blue"}}
                   options={options}/>
  else
    return <Select value={value as string}
                   onChange={(v: string) => onChange(v)}
                   filterOption={(input, option) =>
                     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                   }
                   showSearch={options?.length > 10}
                   options={options}/>
}