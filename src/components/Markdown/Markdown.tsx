import { marked } from "marked"

interface Props {
  source: string
}

export const Markdown = ({ source }: Props) => {
  return <div dangerouslySetInnerHTML={{__html: marked.parse(source ?? '')}}></div>
}