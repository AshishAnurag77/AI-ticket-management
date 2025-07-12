import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const tickets = await response.json();
        
        setStats({
          totalTickets: tickets.length,
          openTickets: tickets.filter(t => t.status === 'open').length,
          resolvedTickets: tickets.filter(t => t.status === 'resolved').length
        });
        
        setRecentTickets(tickets.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.email}!</h1>
        <p className="text-base-content/70">Here's your ticket overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Tickets</div>
          <div className="stat-value text-primary">{stats.totalTickets}</div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Open Tickets</div>
          <div className="stat-value text-warning">{stats.openTickets}</div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Resolved Tickets</div>
          <div className="stat-value text-success">{stats.resolvedTickets}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/create-ticket" className="btn btn-primary w-full">
                Create New Ticket
              </Link>
              <Link to="/tickets" className="btn btn-outline w-full">
                View All Tickets
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary w-full">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Tickets</h2>
            {recentTickets.length > 0 ? (
              <div className="space-y-2">
                {recentTickets.map((ticket) => (
                  <div key={ticket._id} className="p-3 border rounded-lg">
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-base-content/70">
                      Status: <span className={`badge badge-sm ${
                        ticket.status === 'open' ? 'badge-warning' :
                        ticket.status === 'resolved' ? 'badge-success' :
                        'badge-info'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/70">No tickets yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;