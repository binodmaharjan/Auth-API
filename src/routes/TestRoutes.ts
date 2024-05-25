import { Router } from 'express';
import { getAllTests } from '../controllers/TestController';
import { ConstantRoutes } from '../constants/ConstantRoutes';
import { authorize } from '../middleware/authorize';

const router = Router();
const { test } = ConstantRoutes;

router.get(test.getTests, authorize(), getAllTests);

export default router;
