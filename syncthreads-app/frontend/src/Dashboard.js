import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/");
    axios.get("http://localhost:5000/api/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCards(res.data.cards))
      .catch(() => navigate("/"));
  }, [navigate, token]);

  return (
    <div>
      <h2>Dashboard</h2>
      {cards.map((card) => (
        <div key={card.id} onClick={() => navigate("/map")}>{card.title}</div>
      ))}
    </div>
  );
};

export default Dashboard;
