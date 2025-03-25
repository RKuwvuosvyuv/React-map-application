import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './App.css';
import logo from './logo.svg'; // Ensure new logo is in the src folder

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password }, { withCredentials: true });
            localStorage.setItem('token', response.data.token); // Store JWT token
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} alt="App Logo" className="logo" />
                <h2>Login</h2>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} className="input-field" />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="input-field" />
                <button onClick={handleLogin} className="App-link">Login</button>
            </header>
        </div>
    );
};

const Dashboard = () => {
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("User not logged in");
            navigate('/');
            return;
        }

        axios.get('http://localhost:5000/api/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => setCards(response.data.cards))
        .catch(() => alert("Failed to fetch dashboard data"));
    }, [navigate]);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} alt="App Logo" className="logo" />
                <h2>Dashboard</h2>
                <div className="card-container">
                    {cards.map(card => (
                        <div key={card.id} className="card" onClick={() => navigate('/map')}>
                            <h3>{card.title}</h3>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
};

const MapView = () => {
    const [location, setLocation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("User not logged in");
            navigate('/');
            return;
        }

        axios.get('http://localhost:5000/api/map', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => setLocation(response.data.location))
        .catch(() => alert("Failed to fetch map data"));
    }, [navigate]);

    if (!location) return <p>Loading map...</p>;

    return (
        <div className="App">
            <header className="App-header">
                <h2>Map View</h2>
                <MapContainer center={[location.lat, location.lng]} zoom={5} style={{ height: "500px", width: "80%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[location.lat, location.lng]} />
                </MapContainer>
            </header>
        </div>
    );
};

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
);

export default App;
