import { ApiError } from "./api.service";

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error ?? `Request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}
