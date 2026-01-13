import express from 'express';
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientStats
} from '../controllers/patient.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Only admin and receptionist can manage patients
router.post('/', authorize('admin', 'receptionist'), createPatient);
router.get('/', getPatients);
router.get('/stats', getPatientStats);
router.get('/:id', getPatientById);
router.put('/:id', authorize('admin', 'receptionist'), updatePatient);
router.delete('/:id', authorize('admin'), deletePatient);

export default router;