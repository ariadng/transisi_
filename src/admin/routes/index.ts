import { Request, Response, Router } from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => res.send("Admin"));

export { router as AdminRouter };