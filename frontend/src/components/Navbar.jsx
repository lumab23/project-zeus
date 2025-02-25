import React from 'react';
import { FaPaw } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Importe o Link
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <FaPaw className="img" />
            <h1 className="siteName">PET BUDGET</h1>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/home">Adicionar</Link>
          </li>
          <li>
            <Link to="/results">Gastos</Link>
          </li>
          <li>
            <Link to="/historico">Histórico</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;