import TextArea, {type TextAreaRef} from "antd/es/input/TextArea";
import {Button, Upload} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  PaperClipOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import "./TextEditor.css";
import {useEffect, useRef, useState} from "react";
import {type UploadRef} from "antd/es/upload/Upload";
import type {Question, StoredFile, StringLayoutOptions} from "backend/types.ts";
import type {FileParams} from "backend/params.ts";
import {useGetFileLink} from "hooks/useGetFileLink.ts";

interface Props {
  value?: string
  onChange: (value: string) => void;
  question: Question;
  onFileSave?: (params: FileParams) => void
  files?: StoredFile[]
}

export const TextEditor = ({ value, onChange, question, files, onFileSave }: Props) => {
  const ref = useRef<TextAreaRef>(null);
  const uploadRef = useRef<UploadRef>(null);
  const [selection, setSelection] = useState<{ start: number, end: number } | null>(null);

  const getFileLink = useGetFileLink();

  const wrapSelection = (wrapper: string) => {
    const ta = ref.current?.resizableTextArea?.textArea;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    const selected = ta.value.substring(start, end);
    const before = ta.value.substring(0, start);
    const after = ta.value.substring(end);

    setSelection({ start: start + wrapper.length, end: end + wrapper.length });
    onChange(`${before}${wrapper}${selected}${wrapper}${after}`);
  }

  const wrapLines = (number: boolean) => {
    const ta = ref.current?.resizableTextArea?.textArea;
    if (!ta) return;

    const isNewLine = (c: string) => c === '\n' || c === '\r';

    let start = ta.selectionStart;
    let end = ta.selectionEnd;
    while (start > 0 && !isNewLine(ta.value[start-1])) start--
    while (end < ta.value.length - 1 && !isNewLine(ta.value[end])) end++;

    const selected = ta.value.substring(start, end);
    const before = ta.value.substring(0, start);
    const after = ta.value.substring(end);

    const lines = selected.split("\n");

    const wrapped = lines.map((line, i) => `${number ? `${i+1}.` : '*'} ${line}`).join("\n").trim();

    setSelection({ start: start, end: start + wrapped.length });
    onChange(`${before}${wrapped}${after}`);
  }

  useEffect(() => {
    if (selection) {
      const ta = ref.current?.resizableTextArea?.textArea;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selection.start, selection.end);
      setSelection(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const allowAttachments = (question.layout as StringLayoutOptions)?.allowAttachments;

  return <div className="TextEditor">
    <div className="toolbar">
      <Button type="link" onClick={() => wrapSelection("**")}><BoldOutlined /></Button>
      <Button type="link" onClick={() => wrapSelection("_")}><ItalicOutlined /></Button>
      <Button type="link" onClick={() => wrapLines(false)}><UnorderedListOutlined /></Button>
      <Button type="link" onClick={() => wrapLines(true)}><OrderedListOutlined /></Button>
      { allowAttachments &&
          <Button type="link"
                  onClick={() => (document.querySelector('.ant-upload input') as HTMLInputElement)?.click()}>
              <PaperClipOutlined />
          </Button>
      }
    </div>
    <TextArea value={value}
              ref={ref}
              onChange={v => onChange(v.currentTarget.value)} rows={3}/>
    { allowAttachments && (
      <Upload accept=".pdf" maxCount={question.isArray ? undefined : 1}
              ref={uploadRef}
              beforeUpload={v => { onFileSave?.({ questionName: question.name, file: v }); return false; }}
              onRemove={v => onFileSave?.({ questionName: question.name, deleteFileId: v.uid })}
              defaultFileList={files?.map(f => ({ name: f.name, url: getFileLink(f, question.name), uid: f.id.toString() })) ?? []}>
      </Upload>)}
  </div>
}