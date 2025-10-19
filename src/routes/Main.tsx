import {WorkflowInstances} from "routes/WorkflowInstances.tsx";
import {Tabs} from "antd";
import {useTranslate} from "hooks/useTranslate.ts";
import {useSearchParams} from "react-router-dom";
import {endpoints} from "backend/endpoints.ts";

export const Main = () => {
  const { l } = useTranslate();
  const { data } = endpoints.getEntityTypes.useQuery({});
  const [searchParams, setSearchParams] = useSearchParams();

  if (!data) {
    return <i>Loading...</i>
  }

  if (data.length == 0) {
    return <i>You are not authorized to view this page.</i>;
  }

  if (data.length == 1) {
    return <WorkflowInstances entityType={data[0]} />
  }

  return <Tabs
    defaultActiveKey={searchParams.get("tab") ?? undefined}
    onChange={key => setSearchParams(params => {
      params.set("tab", key);
      return params;
    }, { replace: true })}
    items={data.map(t => ({
      key: t.name,
      label: l(t.titlePlural),
      children: <WorkflowInstances entityType={t} />
    }))} />
}