import { signOut } from "firebase/auth";
import { auth } from "../service/firebase";
import toast from "react-hot-toast";

export default function Logout() {
  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully", { duration: 1000 });
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white
                 hover:bg-gray-900 active:scale-95 transition cursor-pointer"
    >
      Logout
    </button>
  );
}
