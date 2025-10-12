import './App.css'
import {Button} from "antd";
import {Outlet} from "react-router-dom";
import {Breadcrumb} from "components/Breadcrumb/Breadcrumb.tsx";
import {useTranslation} from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Workflow</h1>
        <div style={{ float: "right" }}>
          <Button type="link" onClick={() => i18n.changeLanguage(i18n.language === "en" ? "nl" : "en")}>Language: {i18n.language}</Button>
        </div>
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
