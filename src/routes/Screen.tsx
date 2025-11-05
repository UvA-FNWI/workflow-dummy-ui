import { useParams } from "react-router-dom";
import {ScreenTable} from "components/ScreenTable/ScreenTable.tsx";

export const Screen = () => {
  const { entityType, screen } = useParams();

  if (!entityType || !screen) {
    return <div>Invalid parameters</div>;
  }

  return <ScreenTable entityType={entityType} screen={screen} />
};
