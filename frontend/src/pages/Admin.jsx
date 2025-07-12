import { useState, useEffect } from 'react';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, ...updates }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
        setEditingUser(null);
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${
                        user.role === 'admin' ? 'badge-error' :
                        user.role === 'moderator' ? 'badge-warning' :
                        'badge-info'
                      } capitalize`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.skills.map((skill, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-base-content/50">No skills</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit User: {editingUser.email}</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const role = formData.get('role');
              const skills = formData.get('skills').split(',').map(s => s.trim()).filter(s => s);
              updateUser(editingUser._id, { role, skills });
            }}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select name="role" className="select select-bordered" defaultValue={editingUser.role}>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Skills (comma-separated)</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  className="input input-bordered"
                  defaultValue={editingUser.skills?.join(', ') || ''}
                  placeholder="technical, billing, general"
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;