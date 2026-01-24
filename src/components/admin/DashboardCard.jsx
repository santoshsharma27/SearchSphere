import { Link } from "react-router-dom";

function DashboardCard({ title, description, link }) {
  return (
    <Link
      to={link}
      className="block rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
    >
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </Link>
  );
}

export default DashboardCard;
