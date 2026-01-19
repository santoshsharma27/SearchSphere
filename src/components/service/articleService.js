import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getArticles = async () => {
  const snapshot = await getDocs(collection(db, "articles"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
