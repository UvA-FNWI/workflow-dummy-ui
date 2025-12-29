import './App.css'
import {Button} from "antd";
import {Outlet} from "react-router-dom";
import {Breadcrumb} from "components/Breadcrumb/Breadcrumb.tsx";
import {useTranslation} from "react-i18next";
import {backendConfig} from "backend/endpoints.ts";
import {useAuth} from "react-oidc-context";

function App() {
  const { i18n, t } = useTranslation();

  const { signoutRedirect, user } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <div className="top-bar">
          {/*<img src="/logo.png" alt="logo UvA/HvA" />*/}
          <h1 style={{ paddingLeft: "10px" }}>{t('app-title')}</h1>
        </div>
        <div className="breadcrumb-bar">
          <Breadcrumb />
          <div className="actions">
            <a onClick={() => i18n.changeLanguage(i18n.language === "nl" ? "en" : "nl")}>{i18n.language.toUpperCase()}</a>
            <a onClick={() => signoutRedirect()}>{t('logout')} ({user?.profile?.name})</a>
          </div>
        </div>
        <div style={{ float: 'right', fontSize: "12px", textAlign: "right", padding: "5px 10px" }}>
          <div>Endpoint: {backendConfig.endpoint}, version: {backendConfig.version ? backendConfig.version : "default"}
          </div>
        </div>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default App
