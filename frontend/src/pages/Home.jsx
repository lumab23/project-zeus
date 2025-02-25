import React from 'react';
import Navbar from '../components/Navbar';
import AddPurchaseComponent from '../components/AddPurchaseComponent';
import RecentPurchases from '../components/RecentPurchases';

const Home = () => {
    return (
        <div className='home-container'>
            <Navbar />
            <div className='add-purchase-wrapper'>
                <AddPurchaseComponent />
            </div>
            <div className='recent-purchases-wrapper'>
                <RecentPurchases/>
            </div>
        </div>
    )
}

export default Home;