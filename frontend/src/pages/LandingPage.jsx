import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaChartPie, FaReceipt, FaArchive, FaGithub, FaLinkedin } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
      {/* Navbar Placeholder - Assuming Navbar is rendered elsewhere or we can add it here */}
      <nav className="bg-transparent text-white p-4 absolute w-full top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FaPaw className="text-2xl text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-wider">ZEUS</h1>
          </Link>
          <ul className="flex space-x-6">
            <li><a href="#features" className="hover:text-indigo-400 transition-colors duration-300">Recursos</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center min-h-screen flex flex-col justify-center items-center px-4">
        <div className="max-w-4xl mx-auto">
          <FaPaw className="text-7xl text-indigo-400 mx-auto mb-6" />
          <h1 className="text-6xl font-extrabold text-white mb-4 leading-tight">
            Cuidar do seu pet ficou mais fácil.
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Com ZEUS, você organiza todas as despesas do seu amigo de quatro patas em um só lugar. Simples, rápido e eficiente.
          </p>
          <Link 
            to="/home" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-indigo-500/50 text-lg"
          >
            Começar Agora
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <main id="features" className="py-24 px-4 bg-slate-900/50">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Tudo o que você precisa</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
          <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
            <FaReceipt className="text-4xl text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Registro Descomplicado</h3>
            <p className="text-slate-400">Adicione novas compras em segundos com um formulário simples e intuitivo.</p>
          </div>
          
          <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
            <FaChartPie className="text-4xl text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Gráficos Inteligentes</h3>
            <p className="text-slate-400">Visualize para onde seu dinheiro está indo com gráficos claros por categoria.</p>
          </div>
          
          <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
            <FaArchive className="text-4xl text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Histórico Completo</h3>
            <p className="text-slate-400">Acesse e filtre todo o seu histórico de despesas com facilidade.</p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">ZEUS</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/lumab23" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors duration-300">
              <FaGithub size={28} />
            </a>
            <a href="https://www.linkedin.com/in/lbca23" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors duration-300">
              <FaLinkedin size={28} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;