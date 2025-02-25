import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <section className="hero-section">
        <div className="hero-content">
          <h1>Controle seus gastos de forma simples e eficiente</h1>
          <p>Com o PET BUDGET, você pode gerenciar as despesas do seu pet de maneira fácil e rápida. Comece agora e tenha total controle sobre seus gastos.</p>
          <Link to="/home" className="cta-button">Comece Agora</Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Funcionalidades</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Registro de Compras</h3>
            <p>Registre todas as suas compras de forma simples e rápida.</p>
          </div>
          <div className="feature-item">
            <h3>Gráficos e Relatórios</h3>
            <p>Visualize seus gastos com gráficos.</p>
          </div>
          <div className="feature-item">
            <h3>Histórico Completo</h3>
            <p>Acesse o histórico completo de todas as suas compras.</p>
          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
        <div className="footer-contact">
            <h3>Contatos</h3> 
            <div className="social-icons">
              <a href="https://github.com/lumab23" target="_blank" rel="noopener noreferrer">
                <FaGithub className="icon" /> 
              </a>
              <a href="https://www.linkedin.com/in/lbca23" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="icon" /> 
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;