import {Button} from "antd";
import {MessageFilled, MessageOutlined} from "@ant-design/icons";
import {type CSSProperties, useState} from "react";
import {MessagesDialog} from "components/Messages/MessagesDialog.tsx";
import {endpoints} from "backend/endpoints.ts";

export interface MessageProps {
  instanceId: string;
  questionName: string;
}

interface Props {
  style?: CSSProperties
}

export const MessagesButton = ({ style, instanceId, questionName }: Props & MessageProps) => {
  const [open, setOpen] = useState(false);

  const { data } = endpoints.getMessages.useQuery({ instanceId });

  if (!data) return null;

  const messages = data.filter(m => m.questionName === questionName);
  const hasUnresolvedMessage = messages.filter(m => !m.isClosed).length > 0;

  return <>
    <Button type="link" style={{...style, color: hasUnresolvedMessage ? "#777" : "#aaa"}} onClick={() => setOpen(true)}>
      {hasUnresolvedMessage ? <MessageFilled /> : <MessageOutlined />}
    </Button>
    <MessagesDialog open={open}
                    instanceId={instanceId}
                    questionName={questionName}
                    onClose={() => setOpen(false)} />
  </>
}