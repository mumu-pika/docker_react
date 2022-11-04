import logo from './logo.svg';
import './App.css';

import { Routes, Route, Link } from 'react-router-dom';
import DetailPage from './pages/DetailPage';
import Fib from './components/Fib';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to="/">Home</Link>
        <Link to="/detail">DetailPage</Link>
      </header>
      <Routes>
        <Route path="/" element={<Fib />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
