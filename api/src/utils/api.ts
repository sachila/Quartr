import { FetchErrorHandler } from "./errorHandler";

const getApi = async (url: string): Promise<Response> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new FetchErrorHandler(
      `SEC request failed: ${res.status} ${res.statusText}`,
      res.status,
    );
  }
  return res;
};

export { getApi };
