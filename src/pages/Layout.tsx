import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "@tanstack/react-router";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 p-4 min-w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <button
            onClick={() => navigate({ to: "/edit/$id", params: { id: "new" } })}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Contact
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-700px">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
