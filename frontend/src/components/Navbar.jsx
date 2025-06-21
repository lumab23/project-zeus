import React from 'react';
import { FaPaw } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FaPaw className="text-2xl text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-wider">ZEUS</h1>
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/home" className="hover:text-indigo-400 transition-colors duration-300">Adicionar</Link>
          </li>
          <li>
            <Link to="/results" className="hover:text-indigo-400 transition-colors duration-300">Gastos</Link>
          </li>
          <li>
            <Link to="/historico" className="hover:text-indigo-400 transition-colors duration-300">Histórico</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;