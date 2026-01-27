import Logout from "./Logout";
import DashboardCard from "./DashboardCard";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <Logout />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DashboardCard
            title="Create Post"
            description="Write and submit a new article"
            link="/create-post"
          />
          <DashboardCard
            title="Pending Posts"
            description="Review and approve submitted articles"
            link="/admin/pending-posts"
          />
        </div>
      </div>
    </div>
  );
}
