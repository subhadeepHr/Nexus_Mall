"use client";
import React from "react";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/AuthContext";
// import withAuth from "@/lib/withAuth";
import withAuth from "@/lib/withAuth";

const Dashboard = () => {
  const { user } = useAuth();

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p>User not found. Redirecting...</p>
  //     </div>
  //   );
  // }

  return (
    <>
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar data={user} />
      {/* <aside id="dashboard"  className={`leftSide fixed top-5 right-4 z-40 w-4/5 bg-white cust_h-56 p-14 ${
          isSidebarOpen ? "w-4/5  translate-x-0" : " w-auto -translate-x-full" }`} aria-label="dashboard" >
            <h1 className="text-[#262A41] text-2xl">Dashboard</h1> 
        
      </aside> */}
      <aside
        id="dashboard"
        className="relative w-full sm:w-4/5 min-h-[calc(100vh-20px)] sm:h-full  overflow-y-auto sm:ml-64 lg:ml-80 customMl"
      >
        <div className="bg-white rightSideMain min-h-[calc(100vh-20px)] w-[calc(100%-1px)] overflow-y-auto m-auto float-end ">
        <h1 className="text-[#262A41] text-2xl">Welcome, {user.name}</h1>
        </div>
      </aside>

      </div>
    </>
  );
};

export default withAuth(Dashboard);
