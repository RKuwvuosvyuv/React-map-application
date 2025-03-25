import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/dashboard', { withCredentials: true })
            .then(response => setCards(response.data.cards))
            .catch(() => alert("User not logged in"));
    }, []);

    return (
        <div className="App">
            <h2>Dashboard</h2>
            <div className="card-container">
                {cards.map(card => (
                    <div key={card.id} className="card" onClick={() => navigate('/map')}>
                        <h3>{card.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
