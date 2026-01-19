import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../service/firebase";
import { formatDate } from "../../utils/dateFormat";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const snapshot = await getDocs(collection(db, "articles"));
      const data = snapshot.docs.map((doc) => doc.data());

      const matched = data.find((a) => a.slug === slug);
      setArticle(matched);
    };

    fetchArticle();
  }, [slug]);

  if (!article) return <h1 className="text-center mt-10">Loading...</h1>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
        {article.category}
      </span>

      <h1 className="text-4xl font-bold mt-4">{article.title}</h1>

      <div className="text-sm text-gray-500 mt-2 flex gap-4">
        <span>By {article.author}</span>
        <span>{formatDate(article.createdAt)}</span>
        <span>{article.views} views</span>
      </div>

      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full h-[380px] object-cover rounded-xl mt-6 shadow"
      />

      <div className="mt-8 leading-8 text-gray-800 whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
