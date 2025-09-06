import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="flex items-center justify-between px-5 py-4 border-b border-white/10">
      <Link to="/" className="font-bold text-xl">ImageAI</Link>
      {pathname !== '/create' && (
        <Link
          to="/create"
          className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-4 py-2 font-medium"
        >
          + Create new post
        </Link>
      )}
    </nav>
  );
}
