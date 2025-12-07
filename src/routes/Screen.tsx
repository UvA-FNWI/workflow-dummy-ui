import { useParams } from "react-router-dom";
import {ScreenTable} from "components/ScreenTable/ScreenTable.tsx";

export const Screen = () => {
  const { workflowDefinition, screen } = useParams();

  if (!workflowDefinition || !screen) {
    return <div>Invalid parameters</div>;
  }

  return <ScreenTable workflowDefinition={workflowDefinition} screen={screen} />
};
