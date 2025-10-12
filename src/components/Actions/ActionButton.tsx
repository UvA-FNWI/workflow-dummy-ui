import {RightOutlined} from "@ant-design/icons";
import {Button, Popconfirm} from "antd";
import {useTranslate} from "hooks/useTranslate.ts";
import type {Action} from "backend/types.ts";

interface Props {
  action: Action
  loading?: boolean
  onClick: () => void
}

export const ActionButton = ({ action, loading, onClick }: Props) => {
  const { l, t } = useTranslate();

  const content = <><RightOutlined style={{ fontSize: "smaller", color: "#371264", marginRight: "-2px" }} /> {l(action.title)}</>;

  if (action.type === "Execute" && !action.mail) {
    return <Popconfirm title={l(action.title)} description={t("action.confirm")} onConfirm={onClick}
                       okText={t("action.yes")} cancelText={t("action.no")}>
      <Button loading={loading} type="link" style={{ padding: "0" }}>{content}</Button>
    </Popconfirm>
  } else {
    return <Button loading={loading} type="link" style={{ padding: "0" }} onClick={onClick}>{content}</Button>;
  }
}