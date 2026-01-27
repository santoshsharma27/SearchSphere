import { useEffect, useRef, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../service/firebase";
import { uploadImage } from "../service/cloudinary";
import toast from "react-hot-toast";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export default function CreatePost() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("SEO");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const generateSlug = (text) =>
    `${text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")}-${Date.now()}`;

  const validateForm = () => {
    if (!author.trim()) {
      setError("Author name is required");
      return false;
    }
    if (!title.trim()) {
      setError("Article title is required");
      return false;
    }
    if (title.length > 100) {
      setError("Title should be less than 100 characters");
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size should be less than 2MB");
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const publishPost = async () => {
    if (loading) return;

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
      setAuthor("");
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function handleClear() {
    setAuthor("");
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null);
    setError("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

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
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Your article has been submitted successfully and is under
                  review.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="10"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading || success}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
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
                  ref={fileRef}
                  onChange={handleImageChange}
                  disabled={loading || success}
                  className="block w-full text-sm file:mr-4 file:rounded-md
                    file:border-0 file:bg-black file:px-4 file:py-2
                    file:text-white hover:file:bg-gray-800 disabled:opacity-50"
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="mt-3 h-40 rounded-lg object-cover border"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="pt-6 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  aria-disabled={loading}
                  className="w-full sm:w-auto
      px-6 py-3 cursor-pointer
      rounded-lg
      border border-gray-300
      font-semibold
      text-gray-700
      transition
      hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-gray-400
      disabled:opacity-50 disabled:cursor-not-allowed
    "
                >
                  Clear
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`
    w-full sm:flex-1
    px-6 py-3
    rounded-lg
    font-semibold
    text-white
    transition
    ${
      loading || success || error
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-linear-to-r from-blue-600 to-blue-700 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
    }
  `}
                >
                  {loading ? "Publishing..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Clear structure and headings improve SEO
            and readability.
          </p>
        </div>
      </div>
    </div>
  );
}
