import { checkAccess } from "@/lib/access";
import React from "react";
import AccessRestrictedComponent from "../../components/access-restricted";
import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface ResponseCount {
  date: string;
  count: number;
}

interface BarChartProps {
  data: ResponseCount[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Determine the maximum count to set the scale of the bars
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        Response Count for Last 7 Days
      </h2>
      <div className="flex items-end w-full max-w-2xl">
        {data.map((item) => (
          <div key={item.date} className="flex flex-col items-center mr-4">
            <div
              className="bg-blue-600 w-10 rounded-lg"
              style={{
                height: `${(item.count / maxCount) * 100}%` // Adjust height based on count
              }}
            />
            <div className="text-center mt-1">{item.count}</div>
            <div className="text-center">{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = async () => {
  const role = await checkAccess();
  console.log(role);
  const { userId } = auth();

  if (!userId) return redirectToSignIn();

  if (!role) return <AccessRestrictedComponent />;

  const companionCount = await prismadb.companion.count();

  const getResponsesCountLast7Days = async (userId: string) => {
    const today = new Date();
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
    }).reverse(); // Reverse to have from oldest to newest

    // Prepare an array to hold the counts
    const responseCounts = await Promise.all(
      lastSevenDays.map(async (date) => {
        const count = await prismadb.message.count({
          where: {
            userId: userId,
            createdAt: {
              gte: new Date(date + "T00:00:00Z"),
              lt: new Date(date + "T23:59:59Z")
            }
          }
        });
        return { date, count };
      })
    );

    console.log(
      `Response counts for user ${userId} in the last 7 days:`,
      responseCounts
    );
    return responseCounts;
  };

  const responseCnts = await getResponsesCountLast7Days(userId);

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-wrap -mx-6 mb-6">
        {/* <!-- Avatar Count Card --> */}
        <div className="w-full md:w-1/3 px-6 mb-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              Companions Created
            </h3>
            <p className="text-4xl font-bold text-white mt-2">
              {companionCount}
            </p>
            <p className="text-gray-500">Total AI avatars created</p>
          </div>
        </div>
        {/* <!-- Avatar Usage Heatmap --> */}
        <div className="w-full md:w-2/3 px-6mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              {/* Avatar Usage Heatmap */}
            </h3>
            <div
              id="heatmap-container"
              className="mt-4 flex items-center justify-center"
            >
              <BarChart data={responseCnts} />
            </div>
          </div>
        </div>
      </div>

      {/* <!-- User Permissions Form --> */}
      {/* <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-gray-400 text-lg font-semibold mb-4">
          Grant User Permissions to Create Avatars
        </h3>
        <form className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm text-gray-400" htmlFor="user-email">
              User Email
            </label>
            <input
              type="email"
              id="user-email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-200"
              placeholder="Enter user email"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
            Grant Permission
          </button>
        </form>
      </div> */}

      {/* <!-- Other Widgets or Info --> */}
      <div className="mt-6 flex flex-wrap -mx-6">
        <div className="w-full md:w-1/2 px-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              Recent Activity
            </h3>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li>John Doe created an avatar &quot;Elon AI&quot;</li>
              <li>Jane Smith granted permissions</li>
              <li>&quot;Steve AI&quot; avatar was updated</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              System Notifications
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-yellow-500">
                New update available for AI engine
              </li>
              <li className="text-red-500">Server load is at 85%</li>
              <li className="text-green-500">All services running smoothly</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;
