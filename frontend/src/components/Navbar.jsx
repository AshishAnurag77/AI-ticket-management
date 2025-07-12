import { Link } from 'react-router-dom';

function Navbar({ user, logout }) {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <Link to="/dashboard" className="btn btn-ghost text-xl">
          🎫 AI Tickets
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/tickets">My Tickets</Link></li>
          <li><Link to="/create-ticket">Create Ticket</Link></li>
          {user?.role === 'admin' && (
            <li><Link to="/admin">Admin</Link></li>
          )}
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><span className="text-sm opacity-70">{user?.email}</span></li>
            <li><span className="text-sm opacity-70 capitalize">{user?.role}</span></li>
            <li><hr /></li>
            <li><button onClick={logout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;