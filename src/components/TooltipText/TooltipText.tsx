import {Tooltip} from "antd";
import {Markdown} from "components/Markdown/Markdown.tsx";
import {type LocalString, useTranslate} from "hooks/useTranslate.ts";

interface Props {
  text: LocalString | undefined
  description: LocalString | null | undefined
}

export const TooltipText = ({ text, description }: Props) => {
  const { l } = useTranslate();

  return description ?
    <Tooltip title={<Markdown source={l(description)!} />} color="blue">
      <span style={{ textDecoration: "underline", textDecorationStyle: "dashed", textDecorationColor: "#195bb2" }}>{l(text)}</span>
    </Tooltip> : l(text);
}