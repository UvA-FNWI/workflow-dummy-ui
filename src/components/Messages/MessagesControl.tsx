import TextArea from "antd/es/input/TextArea";
import {Button, Checkbox} from "antd";
import {useState} from "react";
import {formatDateTime} from "utilities/formatters.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import type {MessageProps} from "components/Messages/MessagesButton.tsx";
import {endpoints} from "backend/endpoints.ts";
import type {MessageItem} from "backend/types.ts";

interface Props {
  onCancel? : () => void;
}

export const MessageItemDisplay = ({ item } : { item: MessageItem }) => (
  <>
    <div style={{ fontWeight: "bold", fontSize: "small" }}>{item.user.displayName}, {formatDateTime(item.dateTime)}</div>
    {item.body}
  </>
)

const off = "off";

export const MessagesControl = ({ instanceId, questionName, onCancel }: MessageProps & Props) => {
  const [newMessage, setNewMessage] = useState<string | null>(off);
  const [content, setContent] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const { t } = useTranslate();

  const { data } = endpoints.getMessages.useQuery({ instanceId });
  const messages = data?.filter(m => m.questionName === questionName) ?? [];

  const [addMessage, { isLoading }] = endpoints.addMessage.useMutation();

  return <>
    <h3 style={{ marginTop: "0" }}>{t("messages.header")}</h3>
    {messages.filter(m => m.isClosed).length > 0 &&
        <div style={{ marginBottom: "10px" }}><Checkbox onChange={e => setShowClosed(e.target.checked)}>
          {t('show-closed', { count: messages.filter(m => m.isClosed).length })}
        </Checkbox></div>}
    {messages.filter(m => !m.isClosed || showClosed).map(m => <div key={m.id}>
      <MessageItemDisplay item={m.items[0]} />
      <div style={{ marginLeft: "20px" }}>
        { m.items.slice(1).map((r,i) => <div key={i}>
          <MessageItemDisplay item={r} />
        </div>)}
      </div>
      <div className="button-group">
        <Button type="link" onClick={() => setNewMessage(m.id)}>{t("messages.reply")}</Button>
        <Button type="link" onClick={() => addMessage({ kind: "Close", replyToId: m.id, questionName, instanceId })}>{t("messages.close")}</Button>
      </div>
    </div> )}
    { newMessage !== off && <div>
      <TextArea autoFocus value={content} onInput={v => setContent(v.currentTarget.value)} />
      <div className="button-group top-gap">
        <Button type="primary" loading={isLoading} onClick={async () => {
          if (content.trim().length == 0) return;
          await addMessage({ body: content, questionName, instanceId, replyToId: newMessage });
          setNewMessage(off);
          setContent("");
        }}>{t("messages.add")}</Button>
        <Button onClick={() => { if (messages.length === 0) onCancel?.(); else setNewMessage(off); }}>{t("cancel")}</Button>
      </div>
    </div> }
    { newMessage === off && <Button onClick={() => setNewMessage(null)}>{t("messages.new")}</Button> }
  </>
}