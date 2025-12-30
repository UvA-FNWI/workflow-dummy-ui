import {Button, DatePicker, Input, InputNumber, Select, Upload} from "antd";
import dayjs from "dayjs";
import {useTranslate} from "hooks/useTranslate.ts";
import {CurrencyControl, type Currency} from "components/CurrencyControl/CurrencyControl.tsx";
import {InstanceDropdown} from "components/InstanceDropdown/InstanceDropdown.tsx";
import {useCallback, useMemo} from "react";
import debounce from "lodash.debounce";
import type {Answer, QuestionContext, StringLayoutOptions, User} from "backend/types.ts";
import type {AnswerInput, FileParams} from "backend/params.ts";
import {endpoints} from "backend/endpoints.ts";
import {MultiplePickElement} from "components/Picker/MultiplePickElement.tsx";
import {PickElement} from "components/Picker/PickElement.tsx";
import {useGetFileLink} from "hooks/useGetFileLink.ts";
import {TextEditor} from "components/TextEditor/TextEditor.tsx";
import {InputTable} from "components/InputControl/InputTable.tsx";
import {ChoiceInputControl} from "components/InputControl/ChoiceInputControl.tsx";

interface Props {
  value?: unknown
  context: QuestionContext
  onChange?: (val: unknown) => void
  onSave?: (val: AnswerInput) => void
  onFileSave?: (params: FileParams) => void
  answer?: Answer;
  visibleChoices?: string[] | null
}

const parseDate = (value: unknown) => value ? dayjs(value as string) : undefined;

const InputFieldControl = ({ value, context, onChange, onSave, visibleChoices, onFileSave, answer }: Props) => {
  const { t } = useTranslate();

  const question = context.question;

  const save = useCallback((value: unknown) => {
    onSave?.({ questionName: question.name, value });
  }, [question.name, onSave]);
  const change = (value: unknown) => {
    onChange?.(value);
    save(value);
  }

  const getFileLink = useGetFileLink();

  const debouncedSave = useMemo(() => debounce(save, 500), [save]);
  const debouncedChange = (value: unknown) => {
    onChange?.(value);
    debouncedSave(value);
  }

  switch (question.type) {
    case "Choice": {
      const choices = question.choices?.filter(c => !visibleChoices || visibleChoices.includes(c.name));
      return <ChoiceInputControl choices={choices} question={question} value={value} onChange={change} />
    }
    case "String":
      if ((question.layout as StringLayoutOptions)?.multiline)
        return <>
          <TextEditor value={value as string ?? undefined}
                      files={answer?.files}
                      question={question}
                      onFileSave={onFileSave}
                      onChange={debouncedChange}/>
        </>
      if (question.isArray)
        return <Select mode="tags" value={value as string[]} onChange={change}
                       open={false}/>
      else
        return <Input value={value as string ?? undefined}
                      onChange={v => debouncedChange(v.currentTarget.value)} />
    case "Double":
      return <InputNumber value={value as number}
                          onChange={change} />
    case "Int":
      return <InputNumber value={value as number} step={1}
                          onChange={change} />
    case "Date":
      return <DatePicker value={parseDate(value)}
                         onChange={v => debouncedChange(v)} />
    case "DateTime":
      return <DatePicker value={parseDate(value)}
                         onChange={v => debouncedChange(v)}
                         showTime />
    case "File":
      return <Upload accept=".pdf" maxCount={question.isArray ? undefined : 1}
                     beforeUpload={v => { onFileSave?.({ questionName: question.name, file: v }); return false; }}
                     onRemove={v => onFileSave?.({ questionName: question.name, deleteFileId: v.uid })}
                     defaultFileList={answer?.files?.map(f => ({
                       name: f.name,
                       url: getFileLink(f, question.name),
                       uid: f.id.toString()
                     })) ?? []}
      >
        <Button>{t('choose-file', { count: question.isArray ? 2 : 1 })}</Button>
      </Upload>
    case "Object":
      if (question.isArray) {
        return <InputTable context={context} value={answer?.value as unknown[]}
                           onChange={v => debouncedChange(v)}/>
      } else {
        return "Not implemented";
      }
    case "User":
      if (question.isArray)
        return <MultiplePickElement value={value as User[]}
                                    query={endpoints.findUsers}
                                    onChange={u => change(u)}
                                    render={(u : User) => `${u.displayName} (${u.email})`}
                                    placeholder={t('search')} />
      else
        return <PickElement value={value as User}
                            query={endpoints.findUsers}
                            onChange={u => change(u)}
                            render={u => `${u.displayName} (${u.email})`}
                            placeholder={t('search')} />
    case "Currency":
      return <CurrencyControl
        value={value as Currency}
        onChange={c => debouncedChange(c)}
      />
    case "Reference":
      return question.workflowDefinition && <InstanceDropdown value={value}
                                                              onInput={change}
                                                              context={context}
                                                              workflowDefinition={question.workflowDefinition} />
  }
  return <Input />
}

export const InputControl = (props: Props) => {
  return <>
    <InputFieldControl {...props} visibleChoices={props.answer?.visibleChoices} />
  </>
}