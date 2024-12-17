"use client";
import { useState } from "react";
import styles from "../public/static/styles/home.css";
import Image from "next/image";
import Link from "next/link";
import {  LogOut } from 'lucide-react';
import api from "@/lib/axios"; 
import { usePathname, useRouter } from "next/navigation";
import logo from "../public/static/images/logo.png";
import profileDp from "../public/uploads/profileDp.png";
import { useAuth } from "@/contexts/AuthContext";





export default function Sidebar({data}) {
  const { logout, isLoggingOut } = useAuth();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const pathname = usePathname();
    const router = useRouter();

    const handleSidebarToggle = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  


  
    // const handleLogout = async () => {
    //   setIsLoggingOut(true);
    //   try {
    //     await api.post("/logout"); // Your logout API endpoint
    //     localStorage.removeItem("auth_token");
    //     router.push("/");
    //   } catch (err) {
    //     console.error("Error logging out:", err);
    //   } finally {
    //     setIsLoggingOut(false);
    //   }
    // };


    return (
      
      <>
       {/* Toggle Button */}
       <button
        onClick={handleSidebarToggle} // Handle the toggle action
        aria-controls="default-sidebar"
        type="button"
        className="w-45px inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden outline-none"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="#f8b119"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}

      {/* <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 w-1/2 sm:w-1/5 h-auto`} // Toggling translate class based on isSidebarOpen state
       
      > */}


      {/*//   <aside id="default-sidebar"
      //   className="relative w-full sm:w-1/5 h-1/2 sm:h-full transition-transform overflow-y-auto" // Toggling translate class based on isSidebarOpen state
       
      // > */}
      <aside
        id="default-sidebar"
        className={` customWidth fixed top-0 left-0 z-40 h-full w-64 sm:w-1/5 bg-[#692c6c] sm:bg-transparent dark:bg-gray-800 overflow-y-auto transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
       
      >


        <div className="w-full  sm:h-full fixed left-0 overflow-y-auto">
          <div className="flex justify-center items-center logo-wrap">
            <Image alt="" className="text-center py-8" src={logo} width={150} height={50} />
          </div>
          <div className="userWrap relative justify-center items-center">
            <div className="flex user-profile-wrap">

              {/* <div className="absolute inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-red-500 border-white rounded-full -top-4 -end-3 dark:border-gray-900">
                4
              </div> */}
              <Image alt="" className="text-center " src={profileDp} width={72} height={72} />
            </div>
            <div className="">
              <p className="text-center font-semibold margin-top">{data?.name}</p>
              <p className="font-normal opacity-60 text-center">{data?.email}</p>

              <button className="LogoutBtn" 
              onClick={logout}
              disabled={isLoggingOut}>
  
                <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                
                <div className="text">Logout</div>
              </button>
              
             
              
            </div>
          </div>

          <ul className="space-y-2 font-medium sidebarUl">
            <li>
              <Link href="/dashboard" className={pathname === "/dashboard" ? "active flex pl-23" : "flex pl-23"}>
                <span className="ms-3 p-2">Dashboard</span>
                {/* <div className="trbor"></div>
                <div className="blbor"></div> */}
              </Link>
            </li>
            <li>
              <Link href="/user_management" className={pathname === "/user_management" ? "active flex pl-23" : "flex pl-23"}>
                <span className="ms-3 p-2">User Management</span>
                {/* <div className="trbor"></div>
                <div className="blbor"></div> */}
              </Link>
            </li>
            <li>
              <Link href="/patch_management_report" className={pathname === "/patch_management_report" ? "active flex pl-23" : "flex pl-23"}>
                <span className="ms-3 p-2">Patch Management Report</span>
                {/* <div className="trbor"></div>
                <div className="blbor"></div> */}
              </Link>
            </li>
            <li>
              <Link href="/proposal" className={pathname === "/poposal" ? "active flex pl-23" : "flex pl-23"}>
                <span className="ms-3 p-2">Proposal</span>
                {/* <div className="trbor"></div>
                <div className="blbor"></div> */}
              </Link>
            </li>
            <li>
              <Link href="/monthly_patch_management_status" className={pathname === "/monthly_patch_management_status" ? "active flex pl-23" : "flex pl-23"}>
                <span className="ms-3 p-2">Monthly Patch Management Status</span>
                {/* <div className="trbor"></div>
                <div className="blbor"></div> */}
              </Link>
            </li>
            <li>
              <Link href="/server_plan_report" className={pathname === "/server_plan_report" ? "active flex pl-23" : "flex pl-23"}>
                <span className="ms-3 p-2">Server Plan Report</span>
                {/* <div className="trbor"></div>
                <div className="blbor"></div> */}
              </Link>
            </li>
            
          </ul>
        </div>
      </aside>
    </>
  );
}
  