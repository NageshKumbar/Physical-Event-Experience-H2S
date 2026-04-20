import React, { useState, useEffect } from 'react';
import { Map, Coffee, User, ChevronRight, Bell, Calendar, Home, Tag } from 'lucide-react';
import './AttendeeView.css';

export default function AttendeeView() {
  const [activeTab, setActiveTab] = useState('events'); // Default to events portal
  const [activeEvent, setActiveEvent] = useState(null); // The selected event 
  const [events, setEvents] = useState([]);
  
  const [activeQueue, setActiveQueue] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth & Profile State
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [userProfile, setUserProfile] = useState(null);
  const [loginUsername, setLoginUsername] = useState('demo');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');

  // Fetch Events
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/events/')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      })
      .catch(err => console.error("Could not load events", err));
  }, []);

  // Fetch Service Points dynamically based on the Active Event
  useEffect(() => {
    if (activeEvent) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/service-points/?event=${activeEvent.id}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(sp => ({
            id: sp.id,
            name: sp.name,
            waitTime: sp.queue ? `${sp.queue.estimated_wait_time} mins` : 'Wait listed',
            distance: `${sp.distance_ft}ft`,
            type: sp.service_type,
            queueId: sp.queue ? sp.queue.id : null
          })).filter(sp => sp.type === 'food' || sp.type === 'drink' || sp.type === 'merch');
          
          setQueues(formatted);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching queues backend:', err);
          setLoading(false);
        });
    }
  }, [activeEvent]);

  // Fetch securely authenticated user profile + orders
  useEffect(() => {
    if (authToken) {
      fetch('http://127.0.0.1:8000/api/users/me/', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      .then(res => res.json())
      .then(data => {
         if (data.code === "token_not_valid") {
            handleLogout();
         } else {
            setUserProfile(data);
            setEditFirstName(data.first_name);
            setEditLastName(data.last_name);
         }
      })
      .catch(err => console.error("Error fetching profile", err));
    }
  }, [authToken]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    })
    .then(res => res.json())
    .then(data => {
      if (data.access) {
        localStorage.setItem('token', data.access);
        setAuthToken(data.access);
      } else {
        alert("Login failed. Check credentials.");
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUserProfile(null);
  };

  const handleUpdateProfile = () => {
    fetch(`http://127.0.0.1:8000/api/users/${userProfile.id}/`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ first_name: editFirstName, last_name: editLastName })
    })
    .then(res => res.json())
    .then(data => {
      setUserProfile(data);
      setIsEditing(false);
    });
  };

  const joinQueue = (q) => {
    setActiveQueue(q);
    if (q.queueId && authToken) {
      fetch(`http://127.0.0.1:8000/api/queues/${q.queueId}/join/`, { 
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` }
      })
      .catch(err => console.error("Could not join queue", err));
    } else {
        alert("Please login from the Profile tab to place an order.");
        setActiveQueue(null);
    }
  };
  
  return (
    <div className="attendee-layout">
      {/* Dynamic Header */}
      <header className="attendee-header glass-panel neo-border">
        <div>
          <h1 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {activeEvent ? activeEvent.title : 'NEURAL LINK ESTABLISHED'}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
            {activeEvent ? activeEvent.venue_name : 'Global Event Portal'}
          </p>
        </div>
        {activeEvent && (
            <button className="icon-btn" onClick={() => setActiveEvent(null)}>
            <Home size={20} color="var(--primary)" />
            </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="attendee-content">
        
        {/* EVENT PORTAL */}
        {activeTab === 'events' && !activeEvent && (
            <div className="event-portal">
                <h2 className="neon-text" style={{marginBottom: '1rem'}}>UPCOMING EVENTS</h2>
                {events.length === 0 ? <p>Scanning network for events...</p> : (
                    <div className="events-grid">
                        {events.map(ev => (
                            <div key={ev.id} className="event-card glass-panel glitch-hover" onClick={() => { setActiveEvent(ev); setActiveTab('map'); }}>
                                <img src={ev.hero_image_url} alt={ev.title} className="event-image" />
                                <div className="event-info">
                                    <h3 className="gradient-text">{ev.title}</h3>
                                    <p>{new Date(ev.date).toLocaleDateString()}</p>
                                    <div className="event-venue"><Map size={14}/> {ev.venue_name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* DETAILS: MAP */}
        {activeTab === 'map' && activeEvent && (
          <div className="map-view">
            <div 
              className="map-container glass-panel neo-border" 
              style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 12, 0.4), rgba(10, 10, 12, 0.9)), url(${activeEvent.hero_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
              }}
            >
              <div className="map-placeholder">
                <div className="pulse-dot"></div>
                <p style={{fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>Grid Matrix: {activeEvent.venue_name}</p>
                <small style={{color: 'var(--primary)'}}>Holographic Overlay Active</small>
              </div>
            </div>
            
            <div className="map-controls">
              <button 
                className={`btn ${activeRoute === 'restroom' ? 'btn-primary' : 'btn-outline'}`} 
                style={{flex: 1}}
                onClick={() => setActiveRoute('restroom')}
              >
                Locate Restroom
              </button>
              <button 
                className={`btn ${activeRoute === 'exit' ? 'btn-primary' : 'btn-outline'}`} 
                style={{flex: 1}}
                onClick={() => setActiveRoute('exit')}
              >
                Access Extract
              </button>
            </div>
            
            {activeRoute === 'restroom' && (
              <div className="alert-card glass-panel" style={{ borderLeftColor: 'var(--primary)' }}>
                <strong>Routing:</strong> Nearest bio-station located relative to Sector 4.
              </div>
            )}
            
            {activeRoute === 'exit' && (
              <div className="alert-card glass-panel" style={{ borderLeftColor: 'var(--secondary)' }}>
                <strong>Extract:</strong> Main egress point is clear. Wait time: 0 cycles.
              </div>
            )}
          </div>
        )}

        {/* DETAILS: QUEUES/ORDERS */}
        {activeTab === 'queue' && activeEvent && (
          <div className="queue-view">
            <h2 className="neon-text" style={{marginBottom: '1rem'}}>VENDOR UPLINK</h2>
            
            {activeQueue ? (
              <div className="active-queue glass-panel neo-border">
                <h3 className="gradient-text">Connection Established</h3>
                <div className="queue-details">
                  <div className="queue-name">{activeQueue.name}</div>
                  <div className="queue-time gradient-text">Est. cycles: {activeQueue.waitTime}</div>
                  <div className="progress-bar"><div className="progress-fill" style={{width: '60%'}}></div></div>
                  <p>Cyberware ping sequence initiated on order completion.</p>
                </div>
                <button className="btn btn-outline" onClick={() => setActiveQueue(null)} style={{width: '100%'}}>Sever Connection</button>
              </div>
            ) : (
              <div className="queue-list">
                <p style={{marginBottom: '1rem', color: 'var(--primary)'}}>Access vendor nodes bypassing physical queues.</p>
                {loading ? (
                   <div style={{textAlign: 'center', padding: '2rem'}}>Scanning local nodes...</div>
                ) : queues.length === 0 ? (
                   <div style={{textAlign: 'center', padding: '2rem'}}>No active nodes found in this grid.</div>
                ) : (
                  queues.map(q => (
                    <div key={q.id} className="queue-card glass-panel glitch-hover" onClick={() => joinQueue(q)}>
                      <div className="queue-info">
                        <h4>{q.name}</h4>
                        <span className="queue-meta">{q.distance} away</span>
                      </div>
                      <div className="queue-action">
                        <span className="wait-badge block-bg">{q.waitTime}</span>
                        <ChevronRight size={16} color="var(--primary)" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* PROFILE & ORDERS DB */}
        {activeTab === 'profile' && (
          <div className="profile-view">
            {!authToken ? (
              <div className="login-form glass-panel neo-border" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <h2 className="neon-text" style={{textAlign: 'center', marginBottom: '1rem'}}>SYSTEM LOGIN</h2>
                <input 
                  type="text" 
                  value={loginUsername} 
                  onChange={e => setLoginUsername(e.target.value)}
                  className="input-field" 
                  placeholder="Username" 
                />
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)}
                  className="input-field" 
                  placeholder="Password" 
                />
                <button className="btn btn-primary glitch-hover" onClick={handleLogin} style={{marginTop: '1rem'}}>AUTHENTICATE</button>
                <div style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--primary)'}}>
                  USE DEMO CREDENTIALS TO ACCESS MAINFRAME
                </div>
              </div>
            ) : !userProfile ? (
              <div style={{textAlign: 'center', padding: '2rem'}}>Decrypting Profile...</div>
            ) : isEditing ? (
              <div className="edit-profile glass-panel neo-border" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <h2 className="gradient-text">Override Account</h2>
                <input 
                  type="text" 
                  value={editFirstName} 
                  onChange={e => setEditFirstName(e.target.value)}
                  className="input-field" 
                />
                <input 
                  type="text" 
                  value={editLastName} 
                  onChange={e => setEditLastName(e.target.value)}
                  className="input-field" 
                />
                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                  <button className="btn btn-primary" onClick={handleUpdateProfile} style={{flex: 1}}>Patch</button>
                  <button className="btn btn-outline" onClick={() => setIsEditing(false)} style={{flex: 1}}>Abort</button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-header glass-panel neo-border">
                  <div className="avatar-placeholder neon-border">
                    <User size={40} color="var(--primary)" />
                  </div>
                  <div className="profile-info">
                    <h2 className="gradient-text">{userProfile.first_name} {userProfile.last_name}</h2>
                    <p className="neon-text" style={{fontSize: '0.9rem'}}>{userProfile.profile?.membership_level || 'Standard User'}</p>
                  </div>
                  <button className="btn btn-outline" onClick={() => setIsEditing(true)} style={{fontSize: '0.8rem', padding: '6px 12px'}}>
                    Override
                  </button>
                </div>
                
                <h3 className="neon-text" style={{marginTop: '2rem', marginBottom: '1rem'}}>DATA LOGS (ORDERS)</h3>
                <div className="orders-list" style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                    {userProfile.orders?.length === 0 ? <p>No transaction history found.</p> : 
                        userProfile.orders?.map(order => (
                            <div key={order.id} className="glass-panel" style={{padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <div style={{fontWeight: 'bold', color: 'var(--text-main)'}}>
                                        {order.order_type === 'ticket' ? <Tag size={14} style={{display: 'inline', marginRight: '4px'}}/> : <Coffee size={14} style={{display: 'inline', marginRight: '4px'}}/>}
                                        {order.order_type === 'ticket' ? order.event_title : order.service_point_name}
                                    </div>
                                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div className="gradient-text" style={{fontWeight: '900'}}>${order.total_price}</div>
                                    <div style={{fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase'}}>{order.status}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                
                <button className="btn btn-outline" onClick={handleLogout} style={{width: '100%', marginTop: '2rem', color: '#ef4444', borderColor: '#ef4444'}}>
                  Sever Uplink (Log Out)
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* Cyberpunk Bottom Navigation */}
      <nav className="bottom-nav glass-panel neo-border-top">
        <button 
          className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => {setActiveTab('events'); setActiveEvent(null); }}
        >
          <Calendar size={24} />
          <span>Events</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => {
              if(!activeEvent) alert("Select an event first!"); 
              else setActiveTab('map');
          }}
        >
          <Map size={24} />
          <span>Grid</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => {
              if(!activeEvent) alert("Select an event first!");
              else setActiveTab('queue');
          }}
        >
          <Coffee size={24} />
          <span>Nodes</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={24} />
          <span>Sync</span>
        </button>
      </nav>
    </div>
  );
}
