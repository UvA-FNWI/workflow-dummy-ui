import type {EntityType, WorkflowInstance} from "backend/types.ts";
import {endpoints} from "backend/endpoints.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import { Button } from "antd";
import {CsvExport, DataTable, ExcelExport} from "components/DataTable/DataTable.tsx";
import {Link} from "components/Link/Link.tsx";
import {useNavigate} from "hooks/useNavigate.ts";

interface Props {
  entityType: EntityType;
}

export const WorkflowInstances = ({ entityType }: Props) => {
  const {data} = endpoints.getInstances.useQuery({entityType: entityType.name});
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
    {canCreateNew && data && <Button className="gap-below"
                                     type={data.length > 0 ? 'default' : 'primary'}
                                     onClick={newInstance}>{t('new')} {l(entityType?.title)?.toLowerCase()}</Button>}

    {data && <DataTable source={data}
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
  </>;
}