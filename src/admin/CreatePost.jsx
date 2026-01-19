import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../components/service/firebase";
import { Navigate, useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("SEO");
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const generateSlug = (text) => text.toLowerCase().replace(/\s+/g, "-");

  const validateForm = () => {
    if (!author.trim()) {
      setError("Author name is required");
      return false;
    }
    if (!title.trim()) {
      setError("Article title is required");
      return false;
    }
    if (!content.trim()) {
      setError("Article content is required");
      return false;
    }
    return true;
  };

  const publishPost = async () => {
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "articles"), {
        title: title.trim(),
        slug: generateSlug(title),
        content: content.trim(),
        category,
        coverImage:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600",
        author: author.trim(),
        createdAt: Timestamp.now(),
        views: 0,
        tags: [],
      });

      console.log("Article published successfully with ID:", docRef.id);
      setSuccess(true);
      setTitle("");
      setContent("");
      setAuthor("");
      setImage(null);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error publishing article:", err);
      setError("Failed to publish article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Article
          </h1>
          <p className="text-gray-600">
            Share your insights and knowledge with the community
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ Article published successfully! Redirecting...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                publishPost();
              }}
              className="space-y-6"
            >
              {/* Author Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., How to Optimize Your Website for SEO"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                  disabled={loading}
                >
                  <option value="SEO">SEO</option>
                  <option value="AI">AI</option>
                  <option value="Ads">Ads</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write your article content here... Be detailed and informative!"
                  rows="12"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length} characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  onClick={publishPost}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition transform ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:scale-105 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Publishing...
                    </span>
                  ) : (
                    "Publish Article"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setAuthor("");
                    setError("");
                  }}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Write clear, engaging content with proper
            headings and paragraphs for better readability.
          </p>
        </div>
      </div>
    </div>
  );
}
