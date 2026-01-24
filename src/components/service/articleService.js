import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export const getArticles = async () => {
  const q = query(
    collection(db, "articles"),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
