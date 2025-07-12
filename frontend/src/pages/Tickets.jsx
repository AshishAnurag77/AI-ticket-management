import { useState, useEffect } from 'react';

function Tickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError('Failed to fetch tickets');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge-warning',
      'in-progress': 'badge-info',
      resolved: 'badge-success',
      closed: 'badge-neutral'
    };
    return badges[status] || 'badge-neutral';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge-success',
      medium: 'badge-warning',
      high: 'badge-error',
      urgent: 'badge-error'
    };
    return badges[priority] || 'badge-neutral';
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {user.role === 'user' ? 'My Tickets' : 'All Tickets'}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/70 mb-4">No tickets found</p>
          <a href="/create-ticket" className="btn btn-primary">
            Create Your First Ticket
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                {user.role !== 'user' && <th>Created By</th>}
                <th>Assigned To</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-base-content/70 truncate max-w-xs">
                      {ticket.description}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline capitalize">
                      {ticket.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getPriorityBadge(ticket.priority)} capitalize`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(ticket.status)} capitalize`}>
                      {ticket.status}
                    </span>
                  </td>
                  {user.role !== 'user' && (
                    <td>{ticket.createdBy?.email || 'Unknown'}</td>
                  )}
                  <td>{ticket.assignedTo?.email || 'Unassigned'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Tickets;