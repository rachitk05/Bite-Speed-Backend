import express from "express";
const router = express.Router();
import {identify} from "../controllers/indentify.js";


router.post("/identify",identify)

export default router;
