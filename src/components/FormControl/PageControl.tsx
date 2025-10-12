import {Button, Form, type FormRule} from "antd";
import {InputControl} from "components/InputControl/InputControl.tsx";
import {useCallback} from "react";
import {useForm} from "antd/es/form/Form";
import {Markdown} from "components/Markdown/Markdown.tsx";
import {TooltipText} from "components/TooltipText/TooltipText.tsx";
import {useTranslate} from "hooks/useTranslate.ts";
import {VerticalSpace} from "components/Layout/VerticalSpace.tsx";
import {endpoints} from "backend/endpoints.ts";
import type {AnswerInput} from "backend/params.ts";
import type {Page} from "backend/types.ts";

interface Props {
  instanceId: string
  submissionId: string
  page: Page
  last: boolean
  loading: boolean
  next: () => void
}

const requiredAnswer: FormRule = {
  validator: (_, a: unknown) => {
    if (a?.toString()) return Promise.resolve();
    return Promise.reject("Please enter this field");
  }
};

const errorRule = (message: string): FormRule => ({
  validator: () => {
    return Promise.reject(message);
  }
})

export const PageControl = ({ instanceId, submissionId, page, last, loading, next }: Props) => {
  const { data } = endpoints.getSubmission.useQuery({ instanceId, submissionId });
  const [form] = useForm();
  const [saveAnswer] = endpoints.saveAnswer.useMutation();
  const { t, l } = useTranslate();

  const save = useCallback(
    (val: AnswerInput) => saveAnswer({ instanceId, submissionId, answer: val })
      .then(res => form.validateFields(res.data?.answers.map(a => a.questionName))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submissionId]
  );

  const answers = data?.answers.filter(a => a.isVisible).reduce((a,v) => ({
    ...a,
    [v.questionName]: v.value
  }),{}) as { [id: string]: unknown };

  const getAnswer = (questionId: string) => data?.answers.filter(a => a.questionName === questionId)[0];

  const condensed = page.layout === "Condensed";
  const allMandatory = page.questions?.filter(f => !f.isRequired).length === 0;

  const handleNext = async () => {
    await form.validateFields();
    next();
  };

  return <>
    { data &&
    <Form form={form}
          layout={condensed ? "horizontal" : "vertical"}
          labelCol={condensed ? { span: 8 } : undefined}
          initialValues={answers}
          colon={false}
          requiredMark={allMandatory ? false : undefined}
          style={{ maxWidth: 800 }}>
      { page.introduction && <>
        <h3>{l(page.title)}</h3>
        <Markdown source={l(page.introduction)!} />
        <VerticalSpace />
      </> }
      { page.questions!.filter(q => q.name in answers).map(q => {
        const answer = getAnswer(q.name);

        return <Form.Item
          key={q.name}
          label={
            <div>
              {condensed ? <TooltipText text={q.text} description={q.description}/> : l(q.text)}
            </div>}
          required={q.isRequired}
          rules={answer?.validationError ? [errorRule(l(answer.validationError)!)] : q.isRequired ? [requiredAnswer] : []}>
            {q.description && !condensed &&
              <div style={{fontSize: "12px", marginTop: "-3px", marginBottom: "5px"}}><Markdown
                  source={l(q.description)!}/></div>}
          <Form.Item noStyle name={q.name}
                     rules={answer?.validationError ? [errorRule(l(answer.validationError)!)] : q.isRequired ? [requiredAnswer] : []}>
            <InputControl question={q}
                          onSave={val => save(val as AnswerInput)}
                          answer={answer} />
          </Form.Item>
        </Form.Item>;
      }) }
      { !data.dateSubmitted && <Button size="large" loading={loading} type="primary" htmlType="submit" onClick={handleNext}>
        { last ? t("submit") : t("next") }
      </Button> }
    </Form> }
  </>
}