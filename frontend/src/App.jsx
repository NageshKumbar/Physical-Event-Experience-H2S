import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AttendeeView from './pages/AttendeeView.jsx';
import OperatorDashboard from './pages/OperatorDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AttendeeView />} />
          <Route path="/operator" element={<OperatorDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
