const appointmentService = require('../src/services/appointmentService');
const pool = require('../src/config/database');

// Mock the database pool
jest.mock('../src/config/database');

describe('Appointment Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('searchAvailability', () => {
        it('should return available slots for valid parameters', async () => {
            const mockSlots = [
                {
                    slot_id: 'SLOT001',
                    slot_date: '2024-01-15',
                    start_time: '09:00:00',
                    end_time: '09:30:00',
                    staff_id: 'DOC001',
                    first_name: 'John',
                    last_name: 'Doe',
                    specialization: 'Cardiology',
                    hospital_name: 'Central Hospital',
                    department_name: 'Cardiology'
                }
            ];

            pool.execute.mockResolvedValueOnce([mockSlots]);

            const result = await appointmentService.searchAvailability(
                'HOSP001',
                'DEPT001',
                '2024-01-15'
            );

            expect(result).toEqual(mockSlots);
            expect(pool.execute).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                ['2024-01-15', 'HOSP001', 'DEPT001']
            );
        });

        it('should handle database errors', async () => {
            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            await expect(
                appointmentService.searchAvailability('HOSP001', 'DEPT001', '2024-01-15')
            ).rejects.toThrow('Database connection failed');
        });
    });

    describe('bookAppointment', () => {
        it('should successfully book an appointment', async () => {
            const mockAppointmentData = {
                patientId: 'PAT001',
                hospitalId: 'HOSP001',
                departmentId: 'DEPT001',
                staffId: 'DOC001',
                slotId: 'SLOT001',
                date: '2024-01-15',
                time: '09:00:00',
                reason: 'Regular checkup'
            };

            const mockConnection = {
                beginTransaction: jest.fn(),
                execute: jest.fn()
                    .mockResolvedValueOnce([{}]) // Insert appointment
                    .mockResolvedValueOnce([{}]), // Update slot
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn()
            };

            pool.getConnection.mockResolvedValueOnce(mockConnection);

            const result = await appointmentService.bookAppointment(mockAppointmentData);

            expect(result.appointmentId).toContain('APT');
            expect(result.status).toBe('SCHEDULED');
            expect(mockConnection.commit).toHaveBeenCalled();
        });
    });
}); 