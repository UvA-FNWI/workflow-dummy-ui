import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./i18n.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "store.ts";
import App from "App.tsx";
import {WorkflowRoute} from "routing/WorkflowRoute.tsx";
import { Screen } from 'routes/Screen.tsx';
import {Navigate} from "components/Link/Navigate.tsx";
import {AuthProvider, withAuthenticationRequired} from "react-oidc-context";
import {oidcConfig} from "auth.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        element: <Navigate to="/instances" />,
        index: true
      },
      WorkflowRoute,
      {
        path: "screen/:workflowDefinition/:screen",
        element: <Screen />
      }

    ]
  }
])

const AuthenticatedRouterProvider = withAuthenticationRequired(() => <RouterProvider router={router} />)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}
                  onSigninCallback={() => window.history.replaceState({}, "", window.location.pathname)}>
      <Provider store={store}>
        <AuthenticatedRouterProvider />
      </Provider>
    </AuthProvider>
  </StrictMode>,
)
