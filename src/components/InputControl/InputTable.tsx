import {DataTable} from "components/DataTable/DataTable.tsx";
import {useTranslate} from "hooks/useTranslate.ts";
import {InputControl} from "components/InputControl/InputControl.tsx";
import {Button, Flex, Popconfirm} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {VerticalSpace} from "components/Layout/VerticalSpace.tsx";
//import {useState} from "react";
import {AnswerControl} from "components/AnswerControl/AnswerControl.tsx";
import type {QuestionContext, TableLayoutOptions} from "backend/types.ts";

type Row = { [key: string]: unknown };

interface Props {
  value?: unknown[]
  context: QuestionContext
  onChange?: (val: unknown) => void
}

const addProp = (row: Row, key: string, value: unknown) => {
  const newRow = {...row};
  newRow[key] = value;
  return newRow;
}

export const InputTable = ({ context, value, onChange }: Props) => {
  const { l, t } = useTranslate();

  const question = context.question;
  const inline = (question.layout as TableLayoutOptions)?.type !== "Modal";
  //const [editTarget, setEditTarget] = useState<Row | null>(null);

  // const saveValue = (row: Row) => {
  //   const val = value ?? [];
  //   if (val.includes(editTarget as Row)) {
  //     onChange?.(val.map(z => z === editTarget ? row : z));
  //   } else {
  //     onChange?.([...val, row]);
  //   }
  //   setEditTarget(null);
  // }

  const rows = (value as Row[]) ?? [];

  return <>
    <DataTable source={rows} columns={[
      ...question.subProperties!.map(c => ({
        key: c.name,
        header: l(c.text),
        render: (r: { [s: string]: unknown }) => inline ? (
          <InputControl context={context} value={r[c.name]}
                        onChange={v => onChange?.(value!.map(z => z === r ? addProp(r, c.name, v) : z))}
          />
        ) : <AnswerControl answer={{ id: c.name, questionName: c.name, isVisible: true, files: [], value: r[c.name] }} question={c} />
      })),
      {
        key: "action",
        header: "",
        render: (r: Row) => <Flex gap="5px">
          {/*{ !inline && <Button size="small" onClick={() => setEditTarget(r)} icon={<EditOutlined />} /> }*/}
          <Popconfirm title={t('delete-row')} description={t('delete-row-confirm')}
            onConfirm={() => onChange?.(value!.filter(z => z !== r))}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>,
        width: "30px"
      }
    ]} />
    <VerticalSpace />
    <div style={{ textAlign: "right" }}>
      <Button icon={<PlusOutlined />} onClick={() => inline ? onChange?.([ ...(value ?? []), {} ]) : console.log()}>
        {t('add-row')}
      </Button>
    </div>
    {/*{ !inline && question.tableSettings &&*/}
    {/*    <FormDialog open={!!editTarget}*/}
    {/*                onClose={() => setEditTarget(null)}*/}
    {/*                onSave={saveValue}*/}
    {/*                page={question.tableSettings?.form.pages[0]}*/}
    {/*                answers={editTarget} /> }*/}
  </>
}