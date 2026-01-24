import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../service/firebase";
import { ApproveButton, RejectButton } from "./PostModerationButtons";
import Loader from "../pages/Loader";

export default function AdminPendingPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      const q = query(
        collection(db, "articles"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchPendingPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Articles</h1>

      {posts.length === 0 && (
        <p className="text-gray-500">No pending articles 🎉</p>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="sm:w-48 w-full h-52 sm:h-auto  bg-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  By <span className="font-medium">{post.author}</span>
                </p>

                <p className="mt-3 text-gray-700 text-sm">{post.content}</p>

                <p className="mt-2 text-xs text-gray-400">
                  Slug: <span className="font-mono">{post.slug}</span>
                </p>

                <div className="mt-5 flex gap-3">
                  <ApproveButton postId={post.id} />
                  <RejectButton postId={post.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
