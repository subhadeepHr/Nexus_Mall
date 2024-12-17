"use client";
import React from "react";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import withAuth from "@/lib/withAuth";

const ServerReport = () => {
  const { user } = useAuth();

  return (
    <>
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar data={user} />
      <aside
        id="dashboard"
        className="relative w-full sm:w-4/5 min-h-[calc(100vh-20px)] sm:h-full  overflow-y-auto sm:ml-64 lg:ml-80 customMl"
      >
        <div className="bg-white rightSideMain min-h-[calc(100vh-20px)] w-[calc(100%-1px)] overflow-y-auto m-auto float-end ">
        <div className="grid grid-rows-3 grid-flow-col gap-4">
          <div className="row-span-3">
            <h1 className="font-semibold border-heading">Server Plan Report</h1>
          </div>
        </div>
        </div>
      </aside>

      </div>
    </>
  );
};

export default withAuth(ServerReport);
