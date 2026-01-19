// Utility function to format Firestore Timestamp
export const formatDate = (timestamp) => {
  if (!timestamp) return "";

  try {
    // If it's a Firestore Timestamp object
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // If it's a regular JavaScript Date
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // If it's a number (milliseconds)
    if (typeof timestamp === "number") {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return "";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
