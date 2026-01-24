import { useEffect, useState } from "react";
import { getArticles } from "../service/articleService";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormat";
import Loader from "./Loader";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ================= NAVBAR ================= */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Brand */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            SearchSphere
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Create Post – visible everywhere */}
            <Link
              to="/create-post"
              className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg
                   text-sm font-medium hover:bg-green-700 transition"
            >
              Create Post
            </Link>

            {/* Admin – only large screens */}
            <Link
              to="/admin-login"
              className="hidden lg:inline-flex border border-gray-300 text-gray-700
                   px-3 py-2 rounded-lg text-sm font-medium
                   hover:bg-gray-100 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto mt-6 px-4">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600"
            alt="SearchSphere hero"
            loading="lazy"
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-6 text-white">
              <span className="inline-block bg-green-500 text-xs px-3 py-1 rounded-full">
                Featured
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-3 max-w-xl">
                How AI & SEO Are Reshaping Search
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-6xl mx-auto mt-10 px-4 grid md:grid-cols-3 gap-6">
        {/* Articles */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => navigate(`/article/${article.slug}`)}
              className="bg-white border rounded-xl overflow-hidden shadow-sm
                         hover:shadow-lg transition cursor-pointer"
            >
              {/* Image */}
              <div className="h-40 w-full bg-gray-100 overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.views} views
                  </span>
                </div>

                <h3 className="font-semibold mt-2 text-lg line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {article.excerpt || article.content}
                </p>

                <div
                  className="flex justify-between items-center mt-3 pt-3 border-t
                                text-xs text-gray-500"
                >
                  <span>{article.author}</span>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ================= SIDEBAR ================= */}
        <aside className="border rounded-xl p-4 h-fit bg-white">
          <h3 className="font-bold mb-4 text-lg">Trending</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>✔ Top SEO Tools You Must Use</li>
            <li>✔ AI vs Human Content Debate</li>
            <li>✔ Google Algorithm Update</li>
            <li>✔ How to Rank Faster</li>
          </ul>
        </aside>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="max-w-6xl mx-auto mt-14 px-4">
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-600 mt-2">
            Get the latest SEO & Marketing updates
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="px-4 py-2 rounded border w-full sm:w-64"
            />
            <button className="bg-black text-white px-5 py-2 rounded">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t mt-14 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SearchSphere. All rights reserved.
      </footer>
    </div>
  );
}
