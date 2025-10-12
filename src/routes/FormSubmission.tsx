import {useParams} from "react-router-dom";
import {FormControl} from "components/FormControl/FormControl.tsx";

export const FormSubmission = () => {
  const { instanceId, submissionId } = useParams();

  return <FormControl instanceId={instanceId!} submissionId={submissionId!} />
}