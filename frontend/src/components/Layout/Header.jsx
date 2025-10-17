// frontend/src/components/Layout/Header.jsx
import React from 'react';

const Header = ({ patientName, currentView, onNavigate }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🏥 Smart Healthcare System
        </div>
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${currentView === 'booking' ? 'active' : ''}`}
            onClick={() => onNavigate('booking')}
          >
            Book Appointment
          </button>
          <button 
            className={`nav-btn ${currentView === 'appointments' ? 'active' : ''}`}
            onClick={() => onNavigate('appointments')}
          >
            My Appointments
          </button>
          <span className="patient-welcome">Welcome, {patientName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;