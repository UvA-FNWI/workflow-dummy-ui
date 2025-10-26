import {useParams, useSearchParams} from "react-router-dom";
import {DataTable} from "components/DataTable/DataTable.tsx";
import {formatDateTime} from "utilities/formatters.ts";
import {FormViewer} from "components/FormViewer/FormViewer.tsx";
import {Button, Descriptions, Tabs} from "antd";
import {MultipleFormViewer} from "components/FormViewer/MultipleFormViewer.tsx";
import {useState} from "react";
import {useTranslate} from "hooks/useTranslate.ts";
import {ActionButton} from "components/Actions/ActionButton.tsx";
import {StepsTable} from "components/StepsTable/StepsTable.tsx";
import {endpoints} from "backend/endpoints.ts";
import type {Action} from "backend/types.ts";
import {Link} from "components/Link/Link.tsx";
import {extractTitle, useSetTitle} from "hooks/useTitles.ts";
import {useNavigate} from "hooks/useNavigate.ts";
import {Navigate} from "components/Link/Navigate.tsx";

export const WorkflowInstance = () => {
  const { instanceId: instanceIdParam } = useParams();
  const { l, t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const instanceId = instanceIdParam ?? "";

  const { data } = endpoints.getInstance.useQuery({ id: instanceId });
  const [executeAction] = endpoints.executeAction.useMutation();

  const [activeAction, setActiveAction] = useState<string | undefined>();

  useSetTitle(extractTitle(data ?? null));

  const startAction = async (act: Action) => {
    setActiveAction(act.id);
    switch (act.type) {
      case "SubmitForm":
        navigate(`form/${act.form}`);
        break;
      case "Execute":
        await executeAction({type: act.type, instanceId, name: act.name });
        break;
    }
    setActiveAction(undefined);
  }

  const subsToSubmit = data?.actions.filter(s => s.type === "SubmitForm");

  const forms = [...new Set(data?.submissions.map(s => s.form.name))];

  const showAdminTools = data?.permissions.includes("ViewAdminTools");

  return <>
    {data && !data.submissions.filter(s => s.dateSubmitted).length && subsToSubmit && subsToSubmit.length > 0 &&
        <Navigate to={`form/${subsToSubmit[0].form}`} replace={true} /> }
    {data && <div>
        <Descriptions bordered column={1} style={{ width: "400px", marginBottom: "30px", marginTop: "20px" }}>
            <Descriptions.Item label={t("title")}>
              {data.title}
            </Descriptions.Item>
          { data.fields.map((f,i) =>
            <Descriptions.Item key={i} label={l(f.label)}>
              {f.value?.toString()}
              {/*<AnswerControl answer={f.value} />*/}
            </Descriptions.Item>)
          }
          { !!data.actions.length && <Descriptions.Item label="Actions">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "3px" }}>
                { data.actions.map(a => <ActionButton key={a.id} action={a} onClick={() => startAction(a)} loading={activeAction === a.id} />)}
              </div>
          </Descriptions.Item>}
        </Descriptions>

        <Tabs style={{ borderBottom: "1px solid #eee", paddingBottom: "20px" }}
              defaultActiveKey={searchParams.get("tab") ?? undefined}
              onChange={key => setSearchParams({ tab: key }, { replace: true })}
              items={
               forms.map(k => {
                  const subs = data.submissions.filter(s => s.form.name === k);
                  const multiple = subs.length > 1;
                  const sub = subs[0];
                  return {
                    key: k,
                    label: l(sub.form.title),
                    children: <>
                      { multiple && <MultipleFormViewer entityType={data.entityType.name}
                                                        instanceId={instanceId}
                                                        formName={k} /> }
                      { !multiple && <FormViewer submission={sub} /> }
                      <div style={{marginTop: "10px"}} className="button-group">
                        {sub?.permissions.includes("Edit") && <Link to={`form/${sub.id}`}><Button>{t('edit-form')}</Button></Link>}
                      </div>
                    </>
                  };
                })
              }/>
      { data && <StepsTable steps={data.steps}
                            instanceId={instanceId}
                            enableUndo={data.permissions.includes("ViewAdminTools")} /> }
      {showAdminTools && <>
          <h3>{t("submissions")}</h3>
          <DataTable source={data.submissions} columns={[
            {
              key: t('submitted'),
              value: s => s.dateSubmitted,
              render: s => formatDateTime(s.dateSubmitted)
            },
            {
              key: t('form'),
              value: s => s.form.name,
              render: s => s.permissions.includes("Submit") || s.permissions.includes("Edit") ?
                <Link to={`form/${s.id}`}>{s.form.name}</Link> : <>{s.form.name}</>
            }
          ]} />
      </>}
    </div>}
  </>
}