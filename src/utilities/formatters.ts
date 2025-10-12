import dayjs from "dayjs";

export const formatDate = (date: unknown) => date ? dayjs(date as string).format('DD MMM YYYY') : '';
export const formatDateTime = (date: unknown) => date ? dayjs(date as string).format('DD MMM YYYY HH:mm') : '';

export const parseJson = (json: string | null | undefined) => {
  if (!json) return undefined;
  try {
    return JSON.parse(json);
  }
  catch {
    return undefined;
  }
}