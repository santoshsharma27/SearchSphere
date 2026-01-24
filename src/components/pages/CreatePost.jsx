import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../service/firebase";
import { uploadImage } from "../service/cloudinary";
import toast from "react-hot-toast";

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

  const generateSlug = (text) => text.toLowerCase().trim().replace(/\s+/g, "-");

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
    if (!image) {
      setError("Cover image is required");
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
      const slug = generateSlug(title);
      const imageUrl = await uploadImage(image);

      await addDoc(collection(db, "articles"), {
        title: title.trim(),
        slug,
        content: content.trim(),
        category,
        coverImage: imageUrl,
        author: author.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
        approvedAt: null,
        approvedBy: null,
        views: 0,
        tags: [],
      });

      toast.success("Article submitted for review");
      setSuccess(true);

      // Reset form
      setTitle("");
      setContent("");
      setAuthor("");
      setImage(null);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
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

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Your article has been submitted successfully and is under
                  review. Once approved, it will be published on the homepage.
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
              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="SEO">SEO</option>
                  <option value="AI">AI</option>
                  <option value="Ads">Ads</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Marketing">Others</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="12"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  disabled={loading || success}
                />

                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mt-3 h-40 rounded-lg object-cover border"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`flex-1 px-6 py-3 rounded-lg cursor-pointer font-semibold text-white transition
                    ${
                      loading || success
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:scale-105"
                    }`}
                >
                  {loading ? "Publishing..." : "Submit for Review"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setAuthor("");
                    setError("");
                  }}
                  className="px-6 cursor-pointer py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Clear structure and headings improve
            readability and SEO.
          </p>
        </div>
      </div>
    </div>
  );
}
