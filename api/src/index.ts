import express from "express";
import routes from "./routes";
import { errorHandler } from "./utils/errorHandler";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
