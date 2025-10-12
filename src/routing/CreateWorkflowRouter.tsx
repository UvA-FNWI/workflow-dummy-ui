import {createBrowserRouter, type RouteObject} from "react-router-dom";
import {WorkflowRoute} from "routing/WorkflowRoute.tsx";
import type {ReactNode} from "react";

export const createWorkflowRouter = (Root: () => ReactNode, children: RouteObject[]) =>
  createBrowserRouter([{
    path: "/",
    element: <Root/>,
    children: [WorkflowRoute, ...children]
  }]);