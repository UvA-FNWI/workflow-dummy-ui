import {type OidcClientSettings, User} from "oidc-client-ts";
import {oidcAuthority, oidcClientId} from "env.ts";

export const oidcConfig: OidcClientSettings = {
  authority: oidcAuthority ?? "https://auth-pr.datanose.nl/",
  client_id: oidcClientId ?? "datanose.local",
  redirect_uri: window.location.toString(),
  response_type: "code",
  scope: "openid profile"
};

export function getAccessToken() {
  const oidcStorage = window.sessionStorage.getItem(`oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`)
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage).access_token;
}

