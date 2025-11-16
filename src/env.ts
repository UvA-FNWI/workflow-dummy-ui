type EnvVars = {
  endpoint: string,
  oidcClientId?: string,
  oidcAuthority?: string
};

export const { endpoint, oidcClientId, oidcAuthority } = (window as unknown as { _env: EnvVars })._env;