import type {FileParams} from "backend/params.ts";
import {endpoints} from "backend/endpoints.ts";

export const useSaveFile = () => {
  const [saveFile] = endpoints.saveFile.useMutation();
  const [deleteFile] = endpoints.deleteFile.useMutation();

  return async (instanceId: string, submissionId: string, params: FileParams) => {
    if (params.file) {
      await saveFile({instanceId, submissionId, questionName: params.questionName, file: params.file});
    } else if (params.deleteFileId) {
      await deleteFile({instanceId, submissionId, questionName: params.questionName, fileId: params.deleteFileId});
    }
  };
};