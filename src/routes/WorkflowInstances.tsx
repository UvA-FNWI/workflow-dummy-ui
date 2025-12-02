import type {EntityType, WorkflowInstance} from "backend/types.ts";
import {endpoints} from "backend/endpoints.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import { Button } from "antd";
import {CsvExport, DataTable, ExcelExport} from "components/DataTable/DataTable.tsx";
import {Link} from "components/Link/Link.tsx";
import {useNavigate} from "hooks/useNavigate.ts";
import {ScreenTable} from "components/ScreenTable/ScreenTable.tsx";

interface Props {
  entityType: EntityType;
}

export const WorkflowInstances = ({ entityType }: Props) => {
  const screen = entityType.screens?.[0];

  const {data} = endpoints.getInstances.useQuery({entityType: entityType.name}, { skip: !!screen });
  const navigate = useNavigate();
  const [createInstance] = endpoints.createInstance.useMutation();
  const {l, t} = useTranslate();

  const newInstance = async () => {
    if (!entityType) return;
    const res = await createInstance({ entityType: entityType.name });
    navigate(`${res.data?.id}`);
  }

  const canCreateNew = true;

  return <>
    {canCreateNew && <Button className="gap-below"
                                     type={data?.length ?? 1 > 0 ? 'default' : 'primary'}
                                     onClick={newInstance}>{t('new')} {l(entityType?.title)?.toLowerCase()}</Button>}

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
    {screen && <ScreenTable screen={screen} entityType={entityType.name} />}
  </>;
}