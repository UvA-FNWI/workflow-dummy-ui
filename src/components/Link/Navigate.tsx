import { Navigate as RouterNavigate } from 'react-router';
import {useFixedParams} from "hooks/useNavigate.ts";
import type {NavigateProps} from "react-router-dom";

export const Navigate = ({ to, ...props }: NavigateProps) => {
  const paramsString = useFixedParams();

  return (
    <RouterNavigate {...props} to={to + paramsString} />
  );
}