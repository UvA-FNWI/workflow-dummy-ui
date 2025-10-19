import { Link as RouterLink } from 'react-router';
import {type LinkProps} from "react-router-dom";
import {useFixedParams} from "hooks/useNavigate.ts";

export const Link = ({ children, to, ...props }: LinkProps) => {
  const paramsString = useFixedParams();

  return (
    <RouterLink {...props} to={to + paramsString}>
      {children}
    </RouterLink>
  );
}