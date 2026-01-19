import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Link
        to="/admin/create"
        className="bg-black text-white px-4 py-2 rounded"
      >
        + Create New Article
      </Link>
    </div>
  );
}
