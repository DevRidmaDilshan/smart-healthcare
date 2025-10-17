// frontend/src/components/Appointment/AppointmentBooking.jsx
import React, { useState } from 'react';
import HospitalSelection from './HospitalSelection';
import DepartmentSelection from './DepartmentSelection';
import DateTimeSelection from './DateTimeSelection';
import Confirmation from './Confirmation';
import './AppointmentBooking.css';

const AppointmentBooking = ({ hospitals, departments, doctors, patient, onBookAppointment, onCancel, showNotification }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [appointmentData, setAppointmentData] = useState({
        hospitalId: '',
        departmentId: '',
        date: '',
        time: '',
        staffId: '',
        reason: '',
        patientId: patient.patientId
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const updateAppointmentData = (field, value) => {
        setAppointmentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFinalConfirmation = () => {
        onBookAppointment(appointmentData);
    };

    const steps = [
        { number: 1, title: 'Hospital', component: HospitalSelection },
        { number: 2, title: 'Department', component: DepartmentSelection },
        { number: 3, title: 'Date & Time', component: DateTimeSelection },
        { number: 4, title: 'Confirm', component: Confirmation }
    ];

    const CurrentStepComponent = steps[currentStep - 1]?.component;

    return (
        <div className="appointment-booking">
            <div className="booking-header">
                <button className="btn-back" onClick={onCancel}>
                    ← Back to Dashboard
                </button>
                <h2>Book New Appointment</h2>
                <div className="step-indicator">
                    {steps.map(step => (
                        <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''}`}>
                            <div className="step-number">{step.number}</div>
                            <span className="step-title">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="booking-content">
                {CurrentStepComponent && (
                    <CurrentStepComponent
                        appointmentData={appointmentData}
                        updateAppointmentData={updateAppointmentData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        hospitals={hospitals}
                        departments={departments}
                        doctors={doctors}
                        onFinalConfirm={handleFinalConfirmation}
                    />
                )}
            </div>
        </div>
    );
};

export default AppointmentBooking;