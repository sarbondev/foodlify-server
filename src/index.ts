import express, { Express, Request, Response } from "express";
import UserRoutes from "./routes/user.routes";

const PORT = 8000;

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use("/users", UserRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
