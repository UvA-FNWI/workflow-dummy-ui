import {WorkflowInstance} from "routes/WorkflowInstance.tsx";
import {FormSubmission} from "routes/FormSubmission.tsx";
import {Main} from "routes/Main.tsx";

export const WorkflowRoute = {
  path: "instances",
  children: [
    {
      index: true,
      element: <Main />
    },
    {
      path: ":instanceId",
      children: [
        {
          element: <WorkflowInstance />,
          index: true
        },
        {
          element: <FormSubmission />,
          path: "form/:submissionId"
        },
        {
          path: "related/:instanceId",
          children: [
            {
              element: <WorkflowInstance />,
              index: true
            },
            {
              element: <FormSubmission />,
              path: "form/:submissionId"
            },
          ]
        }
      ]
    }
  ]
};