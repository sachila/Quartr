import { Router } from "express";

import { getFilingsSummariesHandler } from "../services/summary.service";
import { getPaginatedFilingsHandler } from "../services/ticker.service";

const router = Router();

router.get("/companies/:ticker/filings", getPaginatedFilingsHandler);
router.get("/filings/summary", getFilingsSummariesHandler);

export default router;
