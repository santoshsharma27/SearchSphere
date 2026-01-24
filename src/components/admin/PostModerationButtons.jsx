import { doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../service/firebase";
import { auth } from "../service/firebase";
import toast from "react-hot-toast";

export function ApproveButton({ postId }) {
  const approve = async () => {
    await updateDoc(doc(db, "articles", postId), {
      status: "approved",
      approvedAt: serverTimestamp(),
      approvedBy: auth.currentUser.email,
    });

    toast.success("Post approved");
    window.location.reload();
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
      onClick={approve}
    >
      Approve
    </button>
  );
}

export function RejectButton({ postId }) {
  const reject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reject and permanently delete this post?",
    );

    if (!confirmed) return;

    await deleteDoc(doc(db, "articles", postId));

    toast.error("Post rejected and deleted");
    window.location.reload();
  };

  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
      onClick={reject}
    >
      Reject
    </button>
  );
}
