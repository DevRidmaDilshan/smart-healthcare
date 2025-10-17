// frontend/src/components/Appointment/__tests__/AppointmentBooking.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentBooking from '../AppointmentBooking';

// Mock the API calls
jest.mock('../../../services/api', () => ({
    appointmentAPI: {
        searchAvailability: jest.fn(),
        bookAppointment: jest.fn()
    }
}));

describe('AppointmentBooking', () => {
    test('renders appointment booking form', () => {
        render(<AppointmentBooking />);
        
        expect(screen.getByText('Book New Appointment')).toBeInTheDocument();
        expect(screen.getByText('Hospital')).toBeInTheDocument();
    });

    test('navigates through steps correctly', () => {
        render(<AppointmentBooking />);
        
        // Check initial step
        expect(screen.getByText('Hospital')).toHaveClass('active');
        
        // Simulate moving to next step
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        
        // Should now be on department selection
        expect(screen.getByText('Department')).toHaveClass('active');
    });
});