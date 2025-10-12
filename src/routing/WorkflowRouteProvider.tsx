import {RouterProvider} from "react-router-dom";
import type {createWorkflowRouter} from "routing/CreateWorkflowRouter.tsx";

interface WorkflowRouteProviderProps {
  router : ReturnType<typeof createWorkflowRouter>;
}

export const WorkflowRouteProvider = ({router}: WorkflowRouteProviderProps) =>
  <RouterProvider router={router}/>