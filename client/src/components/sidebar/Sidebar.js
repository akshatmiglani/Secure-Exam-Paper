import React from "react";

const Sidebar = ({ tabs, activeTab, setActiveTab, onLogout, title }) => {
  return (
    <div className="w-64 bg-gray-800 h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-white text-2xl font-semibold">{title} Panel</h2>
        <ul className="mt-6">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`px-3 py-2 rounded-md cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6">
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
