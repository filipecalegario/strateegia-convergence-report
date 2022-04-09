import './App.css';
import { Routes, Route, Router } from 'react-router-dom';
import Login from './pages/Login';
import Report from './pages/Report';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/report" element={<Report/>} />
      </Routes>
    </div>
  );
}

export default App;
