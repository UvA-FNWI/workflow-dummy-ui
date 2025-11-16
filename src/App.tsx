import './App.css'
import {Button} from "antd";
import {Outlet} from "react-router-dom";
import {Breadcrumb} from "components/Breadcrumb/Breadcrumb.tsx";
import {useTranslation} from "react-i18next";
import {backendConfig} from "backend/endpoints.ts";
import {useAuth} from "react-oidc-context";

function App() {
  const { i18n, t } = useTranslation();

  const { signoutRedirect } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ float: 'right', fontSize: "12px", textAlign: "right" }}>
          <div>Endpoint: {backendConfig.endpoint}, version: {backendConfig.version ? backendConfig.version : "default"} (
            <Button
              type="link"
              style={{ padding: 0, fontSize: "12px" }}
              onClick={() => signoutRedirect({ post_logout_redirect_uri: "https://engine.test.surfconext.nl/logout" })}>
              {t("logout")}
            </Button>)
          </div>
          <div>
            <Button type="link" style={{ padding: "0" }} onClick={() => i18n.changeLanguage(i18n.language === "en" ? "nl" : "en")}>Language: {i18n.language}</Button>
          </div>
        </div>
        <h1>Workflow</h1>
        <div className="App-header-text">

          <Breadcrumb/>
        </div>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default App
