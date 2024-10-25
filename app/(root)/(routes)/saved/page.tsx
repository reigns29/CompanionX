import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import React from "react";
import { Suggestion } from "@prisma/client";

const SavedMessages = async () => {
  const { userId } = auth();
  if (!userId) return redirectToSignIn();
  const suggestions = await prismadb.suggestion.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };
  const handleDelete = (index: any) => {
    console.log("handleDelete");
  };
  console.log(suggestions);
  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Saved Suggestions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out relative"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-semibold py-1 px-2 rounded ${
                  item.type === "Product"
                    ? "bg-blue-600 text-white"
                    : item.type === "Video"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {item.type}
              </span>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200 transition-colors duration-150"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.293 7.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L13.586 12H5a1 1 0 110-2h8.586l-1.293-1.293a1 1 0 010-1.414z" />
                </svg>
              </a>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mt-4">
              {item.name}
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Saved on: {item.createdAt.toDateString()}
            </p>
            <button
              //   onClick={() => handleDelete(index)}
              className="m-1 absolute top-2 right-2 bg-red-600 text-white text-sm py-1 px-2 rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMessages;
