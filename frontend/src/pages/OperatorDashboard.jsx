import React, { useState } from 'react';
import { Users, AlertTriangle, Send, Activity, Settings } from 'lucide-react';
import './OperatorDashboard.css';

export default function OperatorDashboard() {
  const [alertText, setAlertText] = useState('');
  
  return (
    <div className="operator-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel">
        <div className="brand">
          <Activity color="var(--primary)" size={28} />
          <h2>Smart Venue</h2>
          <span className="badge-pro">PRO</span>
        </div>
        
        <nav className="side-nav">
          <button className="side-nav-item active"><Users size={20} /> Crowd Control</button>
          <button className="side-nav-item"><AlertTriangle size={20} /> Alerts & Events</button>
          <button className="side-nav-item"><Settings size={20} /> Venue Settings</button>
        </nav>
      </aside>

      {/* Main Dashboard Area */}
      <main className="dashboard-main">
        <header className="dashboard-header glass-panel">
          <h3>Live Venue Status</h3>
          <div className="stats-row">
            <div className="stat-card">
              <span>Total Attendance</span>
              <strong>42,105</strong>
            </div>
            <div className="stat-card">
              <span>Avg Wait Time</span>
              <strong className="gradient-text">14 min</strong>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Heatmap Area */}
          <section className="heatmap-section glass-panel">
            <div className="section-header">
              <h4>Real-time Crowd Heatmap</h4>
              <div className="legend">
                <span className="dot safe"></span> Free
                <span className="dot warn"></span> Busy
                <span className="dot danger"></span> Congested
              </div>
            </div>
            <div className="heatmap-display">
              {/* Mock Heatmap Nodes */}
              <div className="node danger" style={{top: '20%', left: '30%'}}></div>
              <div className="node warn" style={{top: '40%', left: '60%'}}></div>
              <div className="node safe" style={{top: '70%', left: '40%'}}></div>
              <div className="heatmap-overlay">Live Triangulation Active</div>
            </div>
          </section>

          {/* Coordination Panel */}
          <section className="coordination-section glass-panel">
            <h4>Push Notification Broadcast</h4>
            <p className="subtext">Send contextual alerts to users based on zone.</p>
            
            <div className="form-group">
              <label>Target Zone</label>
              <select className="input-field">
                <option>All Zones</option>
                <option>East Concourse (Congested)</option>
                <option>VIP Section</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="E.g., The East Gate is crowded. Use the North Gate for faster exit."
                value={alertText}
                onChange={(e) => setAlertText(e.target.value)}
              ></textarea>
            </div>
            
            <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
              <Send size={18} /> Broadcast Alert
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
