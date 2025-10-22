import {type NavigateOptions, type To, useNavigate as useRouterNavigate, useSearchParams} from "react-router-dom";
import {useCallback, useMemo} from "react";

export const useNavigate = () => {
  const navigate = useRouterNavigate();
  const paramsString = useFixedParams();

  return useCallback((to: To, options?: NavigateOptions) => {
    navigate(to + paramsString, options);
  }, [navigate, paramsString]);
}

export const useFixedParams = () => {
  const [currentParams] = useSearchParams();
  const version = currentParams.get("version");
  const api = currentParams.get("api");
  return useMemo(() => {
    const newParams = new URLSearchParams();
    if (version) {
      newParams.set("version", version);
    }
    if (api) {
      newParams.set("api", api);
    }
    return newParams.size ? `?${newParams.toString()}` : "";
  }, [version, api]);
}