import type {StoredFile} from "backend/types.ts";
import {backendConfig} from "backend/endpoints.ts";
import {useParams} from "react-router-dom";

export const useGetFileLink = (submissionId?: string) => {
  const { instanceId, submissionId: submissionIdFromParams } = useParams();

  const submissionIdToUse = submissionId ?? submissionIdFromParams;

  return (f: StoredFile, questionName: string) =>
    `${backendConfig.endpoint}/Answers/${instanceId}/${submissionIdToUse}/${questionName}/artifacts/${f.id}?token=${f.accessToken}`;
}