import { Router } from "express";

import routers from "./routers";

const router = Router();

router.use(routers);

export default router;