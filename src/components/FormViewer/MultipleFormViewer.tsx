interface Props {
  instanceId: string;
  workflowDefinition: string
  formName: string
}
export const MultipleFormViewer = ({ instanceId, workflowDefinition, formName }: Props) => {
  return <i>MultipleFormViewer ${workflowDefinition}.${instanceId}.${formName}</i>;
}