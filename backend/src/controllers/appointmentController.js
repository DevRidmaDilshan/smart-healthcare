const appointmentService = require('../services/appointmentService');
const Joi = require('joi');

// Validation schemas
const searchAvailabilitySchema = Joi.object({
    hospitalId: Joi.string().required(),
    departmentId: Joi.string().required(),
    date: Joi.date().iso().required()
});

const bookAppointmentSchema = Joi.object({
    patientId: Joi.string().required(),
    hospitalId: Joi.string().required(),
    departmentId: Joi.string().required(),
    staffId: Joi.string().required(),
    slotId: Joi.string().required(),
    date: Joi.date().iso().required(),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    reason: Joi.string().max(500).optional()
});

class AppointmentController {
    async searchAvailability(req, res) {
        try {
            const { error, value } = searchAvailabilitySchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const slots = await appointmentService.searchAvailability(
                value.hospitalId,
                value.departmentId,
                value.date
            );

            res.json({
                success: true,
                data: slots,
                message: 'Available slots retrieved successfully'
            });

        } catch (error) {
            console.error('Search availability error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async bookAppointment(req, res) {
        try {
            const { error, value } = bookAppointmentSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const result = await appointmentService.bookAppointment(value);

            res.status(201).json({
                success: true,
                data: result,
                message: 'Appointment booked successfully'
            });

        } catch (error) {
            console.error('Book appointment error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getPatientAppointments(req, res) {
        try {
            const { patientId } = req.params;
            
            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    message: 'Patient ID is required'
                });
            }

            const appointments = await appointmentService.getPatientAppointments(patientId);

            res.json({
                success: true,
                data: appointments,
                message: 'Appointments retrieved successfully'
            });

        } catch (error) {
            console.error('Get appointments error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async cancelAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            const { patientId } = req.body;

            if (!appointmentId || !patientId) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointment ID and Patient ID are required'
                });
            }

            const result = await appointmentService.cancelAppointment(appointmentId, patientId);

            res.json({
                success: true,
                data: result,
                message: 'Appointment cancelled successfully'
            });

        } catch (error) {
            console.error('Cancel appointment error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }
}

module.exports = new AppointmentController();