import {Button} from "antd";
import {type ReactNode, useState} from "react";
import {Picker} from "components/Picker/Picker";
import {type PickObject} from "components/Picker/PickObject.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import type {QueryType} from "backend/endpoints.ts";

interface Props<T extends PickObject> {
  onChange?: (o: T) => void
  value?: T
  query: QueryType<T>
  render: (obj: T) => ReactNode | string
  placeholder: string
  disabled?: boolean
}

export const PickElement = <T extends PickObject,>({ value, onChange, disabled = false, ...pickerProps }: Props<T>) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();

  return <>
    <Button type={!value ? 'primary' : 'default'} disabled={disabled}
            onClick={() => setOpen(true)}>{ value && value.displayName }{ !value && <>{t('choose')}</> }</Button>
    <Picker {...pickerProps}
            onPick={o => { onChange?.(o); setOpen(false); }}
            onClose={() => setOpen(false)}
            open={open} />
  </>
}