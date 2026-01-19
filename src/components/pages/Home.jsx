import { useEffect, useState } from "react";
import { getArticles } from "../service/articleService";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateFormat";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getArticles().then((data) => setArticles(data));
  }, []);

  console.log(articles);
  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">SearchSphere</h1>
          <div className="flex gap-6 text-sm font-medium">
            <Link
              to="/admin/create"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Create Post
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mt-6 px-4">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600"
            alt="hero"
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 bg-black/60 text-white p-6 w-full">
            <span className="bg-green-500 text-xs px-3 py-1 rounded-full">
              Featured
            </span>
            <h2 className="text-3xl font-bold mt-3">
              How AI & SEO Are Reshaping Search
            </h2>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-6xl mx-auto mt-8 px-4 grid md:grid-cols-3 gap-6">
        {/* Articles Grid */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/article/${article.slug}`)}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={article.coverImage}
                className="h-40 w-full object-cover"
                alt={article.title}
              />
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.views} views
                  </span>
                </div>
                <h3 className="font-semibold mt-2 text-lg">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {article.content}
                </p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Sidebar */}
        <div className="border rounded-lg p-4 h-fit">
          <h3 className="font-bold mb-4 text-lg">Trending</h3>
          <ul className="space-y-3 text-sm">
            <li>✔ Top SEO Tools You Must Use</li>
            <li>✔ AI vs Human Content Debate</li>
            <li>✔ Google Algorithm Update</li>
            <li>✔ How to Rank Faster</li>
          </ul>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-6xl mx-auto mt-12 px-4">
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-600 mt-2">
            Get the latest SEO & Marketing updates
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="px-4 py-2 rounded border w-64"
            />
            <button className="bg-black text-white px-5 py-2 rounded">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">
        © 2026 SearchBlog. All rights reserved.
      </footer>
    </div>
  );
}
