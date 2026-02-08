type EnvVars = {
  endpoint: string,
  oidcClientId?: string,
  oidcAuthority?: string,
  oidcScope?: string
};

export const { endpoint, oidcClientId, oidcAuthority, oidcScope } = (window as unknown as { _env: EnvVars })._env;