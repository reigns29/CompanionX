import { checkAccess } from "@/lib/access";
import React from "react";
import AccessRestrictedComponent from "../../components/access-restricted";

const Admin = async () => {
  const role = await checkAccess();
  console.log(role);

  if (!role) return <AccessRestrictedComponent />;

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-wrap -mx-6 mb-6">
        {/* <!-- Avatar Count Card --> */}
        <div className="w-full md:w-1/3 px-6 mb-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              Avatars Created
            </h3>
            <p className="text-4xl font-bold text-white mt-2">128</p>
            <p className="text-gray-500">Total AI avatars created</p>
          </div>
        </div>
        {/* <!-- Avatar Usage Heatmap --> */}
        <div className="w-full md:w-2/3 px-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              Avatar Usage Heatmap
            </h3>
            <div id="heatmap-container" className="mt-4 h-64"></div>
          </div>
        </div>
      </div>

      {/* <!-- User Permissions Form --> */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
      </div>

      {/* <!-- Other Widgets or Info --> */}
      <div className="mt-6 flex flex-wrap -mx-6">
        <div className="w-full md:w-1/2 px-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-400 text-lg font-semibold">
              Recent Activity
            </h3>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li>John Doe created an avatar "Elon AI"</li>
              <li>Jane Smith granted permissions</li>
              <li>"Steve AI" avatar was updated</li>
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
