// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [patientData] = useState({
    patientId: 'PAT001',
    name: 'Ridma Dilshan',
    email: 'ridmadilshan.com',
    phoneNumber: '0716319485'
  });
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Mock data
  const mockHospitals = [
    { hospitalId: 'HOSP001', name: 'Colombo National Hospital', type: 'GOVERNMENT', address: 'Colombo 10' },
    { hospitalId: 'HOSP002', name: 'Nawaloka Hospital', type: 'PRIVATE', address: 'Colombo 02' },
    { hospitalId: 'HOSP003', name: 'Asiri Surgical Hospital', type: 'PRIVATE', address: 'Colombo 05' },
    { hospitalId: 'HOSP004', name: 'Karapitiya Teaching Hospital', type: 'GOVERNMENT', address: 'Galle' }
  ];

  const mockDepartments = {
    HOSP001: [
      { departmentId: 'DEPT001', name: 'Cardiology', description: 'Heart and cardiovascular diseases' },
      { departmentId: 'DEPT002', name: 'Neurology', description: 'Brain and nervous system disorders' },
      { departmentId: 'DEPT003', name: 'Pediatrics', description: 'Child healthcare' }
    ],
    HOSP002: [
      { departmentId: 'DEPT004', name: 'Orthopedics', description: 'Bone and joint treatments' },
      { departmentId: 'DEPT005', name: 'Dermatology', description: 'Skin diseases and treatments' },
      { departmentId: 'DEPT006', name: 'Ophthalmology', description: 'Eye care and vision' }
    ]
  };

  const mockDoctors = {
    DEPT001: [
      { staffId: 'DOC001', firstName: 'Dr. Ranil', lastName: 'Perera', specialization: 'Cardiologist' },
      { staffId: 'DOC002', firstName: 'Dr. Saman', lastName: 'Silva', specialization: 'Cardiac Surgeon' }
    ],
    DEPT002: [
      { staffId: 'DOC003', firstName: 'Dr. Priya', lastName: 'Fernando', specialization: 'Neurologist' }
    ]
  };

  // Load appointments function
  const loadAppointments = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockAppointments = [
          {
            appointmentId: 'APT001',
            appointmentDate: '2025-02-15',
            appointmentTime: '10:00',
            status: 'CONFIRMED',
            hospitalName: 'Colombo National Hospital',
            departmentName: 'Cardiology',
            doctorName: 'Dr. Ranil Perera',
            reason: 'Regular heart checkup'
          },
          {
            appointmentId: 'APT002',
            appointmentDate: '2025-02-20',
            appointmentTime: '14:30',
            status: 'PENDING',
            hospitalName: 'Nawaloka Hospital',
            departmentName: 'Orthopedics',
            doctorName: 'Dr. Kamal Gunawardena',
            reason: 'Knee pain consultation'
          }
        ];
        setAppointments(mockAppointments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      showNotification('Failed to load appointments', 'error');
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Handle appointment booking
  const handleBookAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const newAppointment = {
          appointmentId: 'APT' + Date.now(),
          ...appointmentData,
          status: 'CONFIRMED',
          hospitalName: mockHospitals.find(h => h.hospitalId === appointmentData.hospitalId)?.name,
          departmentName: mockDepartments[appointmentData.hospitalId]?.find(d => d.departmentId === appointmentData.departmentId)?.name,
          doctorName: mockDoctors[appointmentData.departmentId]?.find(d => d.staffId === appointmentData.staffId) 
            ? `${mockDoctors[appointmentData.departmentId]?.find(d => d.staffId === appointmentData.staffId)?.firstName} ${mockDoctors[appointmentData.departmentId]?.find(d => d.staffId === appointmentData.staffId)?.lastName}`
            : 'Doctor'
        };
        
        setAppointments(prev => [newAppointment, ...prev]);
        setLoading(false);
        setCurrentView('dashboard');
        showNotification('Appointment booked successfully!', 'success');
      }, 1500);
    } catch (error) {
      showNotification('Failed to book appointment', 'error');
      setLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setTimeout(() => {
        setAppointments(prev => 
          prev.map(apt => 
            apt.appointmentId === appointmentId 
              ? { ...apt, status: 'CANCELLED' }
              : apt
          )
        );
        showNotification('Appointment cancelled successfully', 'success');
      }, 1000);
    } catch (error) {
      showNotification('Failed to cancel appointment', 'error');
    }
  };

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Header Component
  const Header = () => {
    return (
      <header className="header">
        <div className="header-content">
          <div className="logo">
            🏥 Smart Healthcare System
          </div>
          <div className="nav-buttons">
            <button 
              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn ${currentView === 'booking' ? 'active' : ''}`}
              onClick={() => setCurrentView('booking')}
            >
              Book Appointment
            </button>
            <button 
              className={`nav-btn ${currentView === 'appointments' ? 'active' : ''}`}
              onClick={() => setCurrentView('appointments')}
            >
              My Appointments
            </button>
            <span className="patient-welcome">Welcome, {patientData.name}</span>
          </div>
        </div>
      </header>
    );
  };

  // Footer Component
  const Footer = () => {
    return (
      <footer className="footer">
        <p>&copy; 2025 Smart Healthcare System. All rights reserved.</p>
        <p>SE3070 - Case Study Assignment 02</p>
      </footer>
    );
  };

  // Patient Dashboard Component
  const PatientDashboard = () => {
    const upcomingAppointments = appointments.filter(apt => 
      apt.status === 'CONFIRMED' || apt.status === 'PENDING'
    ).slice(0, 3);

    return (
      <div className="dashboard">
        <h2>Patient Dashboard</h2>
        <div className="dashboard-welcome">
          <h3>Welcome back, {patientData.name}!</h3>
          <p>Manage your healthcare appointments and medical records.</p>
        </div>

        <div className="dashboard-actions">
          <div className="action-card" onClick={() => setCurrentView('booking')}>
            <div className="action-icon">📅</div>
            <h4>Book Appointment</h4>
            <p>Schedule a new medical appointment</p>
          </div>
          <div className="action-card" onClick={() => setCurrentView('appointments')}>
            <div className="action-icon">📋</div>
            <h4>View Appointments</h4>
            <p>Check your upcoming appointments</p>
          </div>
          <div className="action-card">
            <div className="action-icon">🏥</div>
            <h4>Medical Records</h4>
            <p>Access your health history</p>
          </div>
        </div>

        <div className="upcoming-appointments">
          <h3>Upcoming Appointments</h3>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map(apt => (
                <div key={apt.appointmentId} className="appointment-card">
                  <div className="appointment-info">
                    <h4>{apt.hospitalName}</h4>
                    <p><strong>Department:</strong> {apt.departmentName}</p>
                    <p><strong>Doctor:</strong> {apt.doctorName}</p>
                    <p><strong>Date:</strong> {apt.appointmentDate} at {apt.appointmentTime}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </p>
                  </div>
                  <div className="appointment-actions">
                    {apt.status !== 'CANCELLED' && (
                      <button 
                        className="btn-cancel"
                        onClick={() => handleCancelAppointment(apt.appointmentId)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming appointments. <span className="link" onClick={() => setCurrentView('booking')}>Book one now!</span></p>
          )}
        </div>
      </div>
    );
  };

  // Appointment List Component
  const AppointmentList = () => {
    return (
      <div className="appointment-list-view">
        <div className="view-header">
          <button className="btn-back" onClick={() => setCurrentView('dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>My Appointments</h2>
        </div>

        {appointments.length > 0 ? (
          <div className="appointments-container">
            {appointments.map(apt => (
              <div key={apt.appointmentId} className="appointment-card detailed">
                <div className="appointment-header">
                  <h3>{apt.hospitalName}</h3>
                  <span className={`status-badge ${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="label">Department:</span>
                    <span className="value">{apt.departmentName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Doctor:</span>
                    <span className="value">{apt.doctorName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date & Time:</span>
                    <span className="value">{apt.appointmentDate} at {apt.appointmentTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Reason:</span>
                    <span className="value">{apt.reason}</span>
                  </div>
                </div>
                <div className="appointment-actions">
                  {apt.status !== 'CANCELLED' && (
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancelAppointment(apt.appointmentId)}
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Appointments Found</h3>
            <p>You don't have any appointments scheduled yet.</p>
            <button 
              className="btn-primary"
              onClick={() => setCurrentView('booking')}
            >
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>
    );
  };

  // Appointment Booking Component
  const AppointmentBooking = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [appointmentData, setAppointmentData] = useState({
      hospitalId: '',
      departmentId: '',
      date: '',
      time: '',
      staffId: '',
      reason: ''
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const updateAppointmentData = (field, value) => {
      setAppointmentData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    // Step 1: Hospital Selection
    const HospitalSelection = () => (
      <div className="booking-step">
        <h3>Select Hospital</h3>
        <div className="hospital-grid">
          {mockHospitals.map(hospital => (
            <div 
              key={hospital.hospitalId}
              className={`hospital-card ${appointmentData.hospitalId === hospital.hospitalId ? 'selected' : ''}`}
              onClick={() => updateAppointmentData('hospitalId', hospital.hospitalId)}
            >
              <h4>{hospital.name}</h4>
              <p className="hospital-type">{hospital.type}</p>
              <p className="hospital-address">{hospital.address}</p>
            </div>
          ))}
        </div>
        <div className="step-actions">
          <button 
            className="btn-primary"
            onClick={nextStep}
            disabled={!appointmentData.hospitalId}
          >
            Next: Select Department
          </button>
        </div>
      </div>
    );

    // Step 2: Department Selection
    const DepartmentSelection = () => (
      <div className="booking-step">
        <h3>Select Department</h3>
        {mockDepartments[appointmentData.hospitalId] ? (
          <div className="department-list">
            {mockDepartments[appointmentData.hospitalId].map(dept => (
              <div 
                key={dept.departmentId}
                className={`department-card ${appointmentData.departmentId === dept.departmentId ? 'selected' : ''}`}
                onClick={() => updateAppointmentData('departmentId', dept.departmentId)}
              >
                <h4>{dept.name}</h4>
                <p>{dept.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No departments available for selected hospital.</p>
        )}
        <div className="step-actions">
          <button className="btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button 
            className="btn-primary"
            onClick={nextStep}
            disabled={!appointmentData.departmentId}
          >
            Next: Select Date & Time
          </button>
        </div>
      </div>
    );

    // Step 3: Date & Time Selection
    const DateTimeSelection = () => (
      <div className="booking-step">
        <h3>Select Date & Time</h3>
        <div className="datetime-selection">
          <div className="form-group">
            <label>Preferred Date:</label>
            <input
              type="date"
              value={appointmentData.date}
              onChange={(e) => updateAppointmentData('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {appointmentData.date && (
            <>
              <div className="form-group">
                <label>Available Time Slots:</label>
                <div className="time-slots">
                  {['09:00', '10:00', '11:00', '14:00', '15:00'].map(time => (
                    <button
                      key={time}
                      className={`time-slot ${appointmentData.time === time ? 'selected' : ''}`}
                      onClick={() => updateAppointmentData('time', time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Select Doctor:</label>
                <select
                  value={appointmentData.staffId}
                  onChange={(e) => updateAppointmentData('staffId', e.target.value)}
                >
                  <option value="">Select a doctor</option>
                  {mockDoctors[appointmentData.departmentId]?.map(doctor => (
                    <option key={doctor.staffId} value={doctor.staffId}>
                      {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Reason for Visit:</label>
                <textarea
                  value={appointmentData.reason}
                  onChange={(e) => updateAppointmentData('reason', e.target.value)}
                  placeholder="Briefly describe the reason for your appointment..."
                  rows="3"
                />
              </div>
            </>
          )}
        </div>
        <div className="step-actions">
          <button className="btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button 
            className="btn-primary"
            onClick={nextStep}
            disabled={!appointmentData.date || !appointmentData.time || !appointmentData.staffId}
          >
            Next: Confirm Booking
          </button>
        </div>
      </div>
    );

    // Step 4: Confirmation
    const Confirmation = () => {
      const hospital = mockHospitals.find(h => h.hospitalId === appointmentData.hospitalId);
      const department = mockDepartments[appointmentData.hospitalId]?.find(d => d.departmentId === appointmentData.departmentId);
      const doctor = mockDoctors[appointmentData.departmentId]?.find(d => d.staffId === appointmentData.staffId);

      const handleConfirm = () => {
        handleBookAppointment(appointmentData);
      };

      return (
        <div className="booking-step">
          <h3>Confirm Appointment Details</h3>
          <div className="confirmation-details">
            <div className="detail-item">
              <strong>Hospital:</strong> {hospital?.name}
            </div>
            <div className="detail-item">
              <strong>Department:</strong> {department?.name}
            </div>
            <div className="detail-item">
              <strong>Doctor:</strong> {doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Not specified'}
            </div>
            <div className="detail-item">
              <strong>Date:</strong> {appointmentData.date}
            </div>
            <div className="detail-item">
              <strong>Time:</strong> {appointmentData.time}
            </div>
            <div className="detail-item">
              <strong>Reason:</strong> {appointmentData.reason || 'Not specified'}
            </div>
          </div>
          <div className="step-actions">
            <button className="btn-secondary" onClick={prevStep}>
              Back
            </button>
            <button className="btn-primary" onClick={handleConfirm}>
              Confirm Booking
            </button>
          </div>
        </div>
      );
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
          <button className="btn-back" onClick={() => setCurrentView('dashboard')}>
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
          {CurrentStepComponent && <CurrentStepComponent />}
        </div>
      </div>
    );
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <PatientDashboard />;
      case 'booking':
        return <AppointmentBooking />;
      case 'appointments':
        return <AppointmentList />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <Header />

      {/* Notification Banner */}
      {notification.message && (
        <div className={`notification-banner ${notification.type}`}>
          {notification.message}
          <button 
            className="close-btn"
            onClick={() => setNotification({ message: '', type: '' })}
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing your request...</p>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {renderCurrentView()}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;