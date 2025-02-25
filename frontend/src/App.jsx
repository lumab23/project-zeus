import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Results from "./pages/Results";
import HistoricoTipo from './pages/HistoricoTipo';
import Historico from './pages/Historico';
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/historico/:type" element={<HistoricoTipo />} />
        <Route path="/historico/" element={<Historico />} />
      </Routes>
    </Router>
  );
};

export default App;