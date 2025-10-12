import {Button, Input, Modal} from "antd";
import {type PropsWithChildren, type ReactNode, useState} from "react";
import styles from "./Picker.module.css";
import {type PickObject} from "components/Picker/PickObject.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import type {QueryType} from "backend/endpoints.ts";

interface Props<T extends PickObject> {
  open: boolean
  onClose: () => void
  onPick: (pick: T) => void
  query: QueryType<T>
  render: (obj: T) => ReactNode | string
  placeholder: string
}

export const Picker = <T extends PickObject,>({ open, onClose, onPick, query, render, placeholder, children }: PropsWithChildren<Props<T>>) => {
  const [input, setInput] = useState('');
  const { t } = useTranslate();

  const { data, loading } = query.useQuery({ query: input }, { skip: input.length < 3 });

  return <Modal title={t("picker.title")}
                open={open}
                footer={null}
                onCancel={onClose}
  >
    <Input onChange={t => setInput(t.currentTarget.value)} placeholder={placeholder} />
    <div className={styles.results}>
      { data && data.map((u: T) => <div key={u.id}>
        <Button type="link" onClick={() => onPick(u)}>{render(u)}</Button>
      </div>) }
      { loading && <i>{t("picker.loading")}</i> }
    </div>
    {children}
  </Modal>
}