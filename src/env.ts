type EnvVars = {
  endpoint: string,
};

export const { endpoint } = (window as unknown as { _env: EnvVars })._env;