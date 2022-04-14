import './App.css';
import { Routes, Route, Router } from 'react-router-dom';
import Login from './pages/Login';
import Report from './pages/Report';
import Signin from './pages/Signin';
import Canvas from './pages/Canvas';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/report" element={<Report />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </div>
  );
}

export default App;
