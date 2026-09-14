import type { NextFunction, Request, Response } from "express";

export class FetchErrorHandler extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "Fetch Error";
    this.status = status;
  }
}

// Central error handler: Express 5 forwards rejected async route handlers here automatically.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof FetchErrorHandler) {
    res.status(502).json({ error: "Failed to fetch data from SEC EDGAR" });
    return;
  }
  res.status(500).json({ error: "Internal server error" });
};
