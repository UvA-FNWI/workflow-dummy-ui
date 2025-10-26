import {formatDate, formatDateTime} from "utilities/formatters.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import {Markdown} from "components/Markdown/Markdown.tsx";
import type {Answer, DataType, Question, StringLayoutOptions, User} from "backend/types.ts";
import type {Currency} from "components/CurrencyControl/CurrencyControl.tsx";
import {useGetFileLink} from "hooks/useGetFileLink.ts";

interface Props {
  answer: Answer
  question?: Question
  type?: DataType
  isPart?: boolean
  submissionId?: string
}

export const AnswerControl = (props: Props) => {
  const control = <AnswerControlInternal {...props} />;
  // if (answer.href)
  //   return <Link to={answer.href}>{control}</Link>
  return control;
}

const AnswerControlInternal = ({ answer, question, type, isPart, submissionId }: Props) => {
  const { l } = useTranslate();
  const getFileLink = useGetFileLink(submissionId);

  if (question?.isArray && !isPart && question.type != "File") {
    const entries = answer.value as unknown[];
    return <div>{ entries?.map((e,i) =>
      <div key={i}>
        <AnswerControlInternal answer={{ ...answer, value: e }} question={question} type={type} isPart={true} submissionId={submissionId} />
      </div>) }
    </div>;
  }

  switch (type ?? question?.type) {
    case "File":
      return <>{ answer.files?.map(f => <div key={f.id}><a href={getFileLink(f, question?.name ?? "Broken!")} target="_blank">{f.name}</a></div>)}</>
    case "Date":
      return formatDate(answer.value);
    case "DateTime":
      return formatDateTime(answer.value);
    case "User":
      return (answer.value as User)?.displayName;
    case "Choice":
      return l(question?.choices?.filter(c => c.name === answer.value)[0]?.text);
    case "Currency": {
      const currency = answer.value as Currency;
      return `${currency?.currency} ${currency?.amount}`;
    }
    // case DataType.Table:
    //   return <TableViewer answer={answer} />
  }
  if (answer.value && (question?.layout as StringLayoutOptions)?.multiline) {
    return <>
      <Markdown source={answer.value as string} />
      {/*{ answer.files?.map(f => <div><a href={f.url ?? undefined} target="_blank">{f.name}</a></div>)}*/}
    </>
  }
  return <>
    {answer.value?.toString()}
  </>
}