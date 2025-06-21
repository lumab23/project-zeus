import React from 'react';
import Navbar from '../components/Navbar';
import AddPurchaseComponent from '../components/AddPurchaseComponent';
import RecentPurchases from '../components/RecentPurchases';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
            <Navbar />
            <main className='container mx-auto p-8'>
                <h1 className="text-5xl font-extrabold text-white mb-10">Painel Principal</h1>
                <div className="space-y-8">
                    <AddPurchaseComponent />
                    <RecentPurchases/>
                </div>
            </main>
        </div>
    )
}

export default Home;