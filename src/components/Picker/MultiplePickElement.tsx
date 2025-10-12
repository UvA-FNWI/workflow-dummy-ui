import {Button} from "antd";
import {type ReactNode, useState} from "react";
import {Picker} from "components/Picker/Picker";
import {type PickObject} from "components/Picker/PickObject.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import {DeleteOutlined} from "@ant-design/icons";
import type {QueryType} from "backend/endpoints.ts";

interface Props<T extends PickObject> {
  onChange?: (o: T[]) => void
  value?: T[]
  query: QueryType<T>
  render: (obj: T) => ReactNode | string
  disabled?: boolean
  placeholder: string
}

export const MultiplePickElement = <T extends PickObject,>({ value, onChange, disabled = false, ...pickerProps }: Props<T>) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();

  return <>
    <div className="button-group">
      {value?.map(v => <Button key={v.id} onClick={() => onChange?.(value?.filter(o => o.id !== v.id))}>
        {v.displayName} <DeleteOutlined />
      </Button>)}
      <Button disabled={disabled}
              onClick={() => setOpen(true)}>{t('add')}</Button>
    </div>
    <Picker {...pickerProps}
            onPick={o => { onChange?.([...(value ?? []), o]); setOpen(false); }}
            onClose={() => setOpen(false)}
            open={open} />
  </>
}