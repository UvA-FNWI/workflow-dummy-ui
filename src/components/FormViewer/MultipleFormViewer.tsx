interface Props {
  instanceId: string;
  entityType: string
  formName: string
}
export const MultipleFormViewer = ({ instanceId, entityType, formName }: Props) => {
  return <i>MultipleFormViewer ${entityType}.${instanceId}.${formName}</i>;
}