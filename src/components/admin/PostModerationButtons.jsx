import { doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../service/firebase";
import { auth } from "../service/firebase";
import { useState } from "react";
import toast from "react-hot-toast";

export function ApproveButton({ postId, onAction }) {
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await updateDoc(doc(db, "articles", postId), {
        status: "approved",
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.email || "admin",
      });

      toast.success("Post approved");
      onAction?.(postId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={approve}
      disabled={loading}
      className={`px-4 py-2 rounded text-white transition cursor-pointer
        ${
          loading
            ? "bg-green-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
    >
      {loading ? "Approving..." : "Approve"}
    </button>
  );
}

export function RejectButton({ postId, onAction }) {
  const [loading, setLoading] = useState(false);

  const reject = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject and permanently delete this post?",
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteDoc(doc(db, "articles", postId));
      toast.success("Post rejected");
      onAction?.(postId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={reject}
      disabled={loading}
      className={`px-4 py-2 rounded text-white transition cursor-pointer
        ${
          loading
            ? "bg-red-300 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
    >
      {loading ? "Rejecting..." : "Reject"}
    </button>
  );
}
