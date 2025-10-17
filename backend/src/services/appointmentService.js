const pool = require('../config/database');

class AppointmentService {
    // Search available slots
    async searchAvailability(hospitalId, departmentId, date) {
        const query = `
            SELECT 
                s.slot_id,
                s.slot_date,
                s.start_time,
                s.end_time,
                ms.staff_id,
                ms.first_name,
                ms.last_name,
                ms.specialization,
                h.name as hospital_name,
                d.name as department_name
            FROM appointment_slots s
            JOIN medical_staff ms ON s.staff_id = ms.staff_id
            JOIN departments d ON ms.department_id = d.department_id
            JOIN hospitals h ON d.hospital_id = h.hospital_id
            WHERE s.slot_date = ? 
            AND s.status = 'AVAILABLE'
            AND h.hospital_id = ?
            AND d.department_id = ?
            ORDER BY s.start_time
        `;
        
        const [slots] = await pool.execute(query, [date, hospitalId, departmentId]);
        return slots;
    }

    // Book appointment
    async bookAppointment(appointmentData) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Generate appointment ID
            const appointmentId = 'APT' + Date.now();
            
            // Insert appointment
            const insertAppointmentQuery = `
                INSERT INTO appointments (
                    appointment_id, patient_id, hospital_id, department_id, 
                    staff_id, appointment_date, appointment_time, status, reason
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?)
            `;
            
            await connection.execute(insertAppointmentQuery, [
                appointmentId,
                appointmentData.patientId,
                appointmentData.hospitalId,
                appointmentData.departmentId,
                appointmentData.staffId,
                appointmentData.date,
                appointmentData.time,
                appointmentData.reason
            ]);
            
            // Update slot status
            const updateSlotQuery = `
                UPDATE appointment_slots 
                SET status = 'BOOKED' 
                WHERE slot_id = ?
            `;
            
            await connection.execute(updateSlotQuery, [appointmentData.slotId]);
            
            await connection.commit();
            
            return {
                appointmentId,
                status: 'SCHEDULED',
                message: 'Appointment booked successfully'
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get patient appointments
    async getPatientAppointments(patientId) {
        const query = `
            SELECT 
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                a.status,
                a.reason,
                h.name as hospital_name,
                d.name as department_name,
                CONCAT(ms.first_name, ' ', ms.last_name) as doctor_name
            FROM appointments a
            JOIN hospitals h ON a.hospital_id = h.hospital_id
            JOIN departments d ON a.department_id = d.department_id
            JOIN medical_staff ms ON a.staff_id = ms.staff_id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;
        
        const [appointments] = await pool.execute(query, [patientId]);
        return appointments;
    }

    // Cancel appointment
    async cancelAppointment(appointmentId, patientId) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Get appointment details
            const [appointments] = await connection.execute(
                'SELECT * FROM appointments WHERE appointment_id = ? AND patient_id = ?',
                [appointmentId, patientId]
            );
            
            if (appointments.length === 0) {
                throw new Error('Appointment not found');
            }
            
            // Update appointment status
            await connection.execute(
                'UPDATE appointments SET status = "CANCELLED" WHERE appointment_id = ?',
                [appointmentId]
            );
            
            // Free up the slot (implementation depends on slot tracking)
            
            await connection.commit();
            
            return { message: 'Appointment cancelled successfully' };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new AppointmentService();