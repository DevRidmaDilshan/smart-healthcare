const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

// Appointment routes
router.get('/availability', appointmentController.searchAvailability);
router.post('/book', appointmentController.bookAppointment);
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
router.put('/cancel/:appointmentId', appointmentController.cancelAppointment);

module.exports = router;