import type {WorkflowDefinition, WorkflowInstance} from "backend/types.ts";
import {endpoints} from "backend/endpoints.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import { Button } from "antd";
import {CsvExport, DataTable, ExcelExport} from "components/DataTable/DataTable.tsx";
import {Link} from "components/Link/Link.tsx";
import {useNavigate} from "hooks/useNavigate.ts";
import {ScreenTable} from "components/ScreenTable/ScreenTable.tsx";

interface Props {
  workflowDefinition: WorkflowDefinition;
}

export const WorkflowInstances = ({ workflowDefinition }: Props) => {
  const screen = workflowDefinition.screens?.[0];

  const {data} = endpoints.getInstances.useQuery({workflowDefinition: workflowDefinition.name}, { skip: !!screen });
  const navigate = useNavigate();
  const [createInstance] = endpoints.createInstance.useMutation();
  const {l, t} = useTranslate();

  const newInstance = async () => {
    if (!workflowDefinition) return;
    const res = await createInstance({ workflowDefinition: workflowDefinition.name });
    navigate(`${res.data?.id}`);
  }

  const canCreateNew = true;

  return <>
    {canCreateNew && <Button className="gap-below"
                                     type={data?.length ?? 1 > 0 ? 'default' : 'primary'}
                                     onClick={newInstance}>{t('new')} {l(workflowDefinition?.title)?.toLowerCase()}</Button>}

    {data && !screen && <DataTable source={data}
                        exports={[
                          ExcelExport<WorkflowInstance>("requests"),
                          CsvExport<WorkflowInstance>("requests")
                        ]}
                        columns={[
                          {
                            key: "id",
                            value: t => t.id,
                            render: t => <Link to={t.id}>{t.id}</Link>
                          }
                        ]}/>}
    {screen && <ScreenTable screen={screen} workflowDefinition={workflowDefinition.name} />}
  </>;
}