import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [stats.positiveSentiment, stats.neutralSentiment, stats.negativeSentiment],
        backgroundColor: ['#4caf50', '#9e9e9e', '#f44336'],
      },
    ],
  };

  const feedbackData = {
    labels: ['Positive Feedback', 'Negative Feedback'],
    datasets: [
      {
        label: 'Feedback Distribution',
        data: [stats.positiveFeedback, stats.negativeFeedback],
        backgroundColor: ['#2196f3', '#ff9800'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="stats-container">
        <div className="stat-box">
          <h3>Total Messages</h3>
          <p>{stats.totalMessages}</p>
        </div>
        <div className="stat-box">
          <h3>Most Frequent Intent</h3>
          <p>{stats.mostFrequentIntent}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Sentiment Analysis</h3>
          <Bar data={sentimentData} options={{ responsive: true }} />
        </div>

        <div className="chart-box">
          <h3>Feedback Analysis</h3>
          <Bar data={feedbackData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="recent-chats-container">
        <h3>Recent Chats</h3>
        <ul>
          {stats.recentChats.map((chat, index) => (
            <li key={index}>
              <span>{new Date(chat.timestamp).toLocaleString()}</span>: {chat.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
