interface Props {
  instanceId: string,
  submissionId: string
}
export const FormViewer = ({ instanceId, submissionId }: Props) => {
  return <i>FormViewer ${instanceId}.${submissionId}</i>;
}