import type {QuestionContext} from "backend/types.ts";
import {endpoints} from "backend/endpoints.ts";
import {useTranslate} from "hooks/useTranslate.ts";

interface Props {
  context: QuestionContext
}

export const ReferenceViewer = ({ context }: Props) => {
  const { l } = useTranslate();

  const { data } = endpoints.getCurrentChoices.useQuery({
    instanceId: context.instanceId,
    submissionId: context.submissionId,
    questionName: context.question.name
  });
  return <>{data?.map(c => <div>{l(c.text)}</div>)}</>;
}