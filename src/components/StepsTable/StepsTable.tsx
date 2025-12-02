import {DataTable} from "components/DataTable/DataTable.tsx";
import {formatDateTime} from "utilities/formatters.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import {Button} from "antd";
import {UndoOutlined} from "@ant-design/icons";
import type {Step} from "backend/types.ts";
import {endpoints} from "backend/endpoints.ts";

interface Props {
  instanceId: string;
  steps: Step[];
  enableUndo: boolean;
}

export const StepsTable = ({ steps, instanceId, enableUndo }: Props) => {
  const { l, t } = useTranslate();
  const [undoEvent] = endpoints.undoEvent.useMutation();

  return <>
    <h3>{t("steps")}</h3>
    <DataTable source={steps} columns={[
      {
        key: t('step'),
        value: s => l(s.title)
      },
      {
        key: t('completed'),
        value: s => formatDateTime(s.dateCompleted)
      },
      {
        key: t('deadline'),
        value: s => formatDateTime(s.deadline)
      },
      {
        key: t('undo'),
        render: s => s.dateCompleted && s.event &&
            <Button type="link"
                    onClick={() => undoEvent({ instanceId, eventName: s.event ?? "" })}>
                <UndoOutlined />
            </Button>,
        hide: !enableUndo
      }
    ]} />
  </>;
}