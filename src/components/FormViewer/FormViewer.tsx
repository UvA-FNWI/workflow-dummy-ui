import {DataTable} from "components/DataTable/DataTable.tsx";
import {AnswerControl} from "components/AnswerControl/AnswerControl.tsx";
import {useTranslate} from "hooks/useTranslate.ts";
import type {Answer, Submission} from "backend/types.ts";

interface Props {
  submission: Submission
}
export const FormViewer = ({ submission }: Props) => {
  const model = submission.form;
  const { l, t } = useTranslate();

  const isNonTrivial = (a: Answer) => !!a.value;

  return <>{ submission && model &&
    model.pages.map(page => {
      const data = submission.answers
        .map(a => ({
          id: a.id,
          answer: a,
          question: page.questions.filter(q => q.name === a.questionName && !q.hideInResults)[0]
        }))
        .filter(a => a.question && a.answer.isVisible && isNonTrivial(a.answer));
      return (
        <div key={page.index}>
          {model.pages.length > 1 && <h3>{l(page.title)}</h3>}
          <DataTable source={data}
                     columns={[{
                       key: t('question'),
                       value: a => l(a.question.shortText)
                     },
                       {
                         key: t('answer'),
                         render: a => <>
                           <div style={{display: "flex", alignItems: "center"}}>
                             <span style={{flexGrow: "1"}}><AnswerControl answer={a.answer} question={a.question} /></span>
                           </div>
                         </>
                       }]}/>
        </div>
      )
    })
  }
  </>
}