"use client";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
// import { FiFile, FiPlusSquare   } from "react-icons/fi";
import { FileText } from 'lucide-react';
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from '@/contexts/AuthContext';
import withAuth from "@/lib/withAuth";
// import {Select, SelectSection, SelectItem} from "@nextui-org/select";

const Patch_Management = () => {
// export default function Patch_Management() {
  // Modal state
  const { user } = useAuth();
    // Months and Years
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    const [Patchmonth, setPatchmonth] = useState("");
    const [Patchyear, setPatchyear] = useState("");
  
    // Patch Report Data
    const [patchReportData, setPatchReportData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
  const [formData, setFormData] = useState({
    patch_report_name: "",
    patch_report_month: "",
    patch_report_year: "",
    patch_report_file: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('patch_report_name', formData.patch_report_name);
    formDataToSend.append('patch_report_month', formData.patch_report_month);
    formDataToSend.append('patch_report_year', formData.patch_report_year);

    if (selectedFile) {
      formDataToSend.append('patch_report_file', selectedFile);
    }

    try {
   
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/add-patch-report`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          // "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Patch report added !');
      } else {
        setSuccessMessage('Failed to submit patch report.');
      }
    } catch (error) {
      setSuccessMessage('An error occurred while submitting the patch report.');
    }
  };






  // Fetch Months
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-months`
        );
        const data = await response.json();
        setMonths(data.months || []);
      } catch (error) {
        console.error("Error fetching months:", error);
      }
    };
    fetchMonths();
  }, []);

  // Fetch Years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-years`
        );
        const data = await response.json();
        setYears(data.years || []);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, []);

  // Fetch Patch Report Data with Pagination
  const fetchData = async (selectedMonth, selectedYear, page) => {
    if (!selectedMonth || !selectedYear) return;
    setIsLoading(true);
    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-patch-report-data?month=${selectedMonth}&year=${selectedYear}`,
        { page },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const { datas, totalPages } = response.data;
      
      setPatchReportData(response.data || []);
      setTotalPages(totalPages || 1);
    
    } catch (error) {
      console.error("Error fetching patch report data:", error);
      setPatchReportData([]);
    } finally {
      setIsLoading(false); // Set loading to false after the fetch completes
    }
  };

  // Handle Dropdown Changes
  const handleMonthChange = (value) => {
    setPatchmonth(value);
    fetchData(value, Patchyear, 1);
    setCurrentPage(1); // Reset page to 1 on new filter
  };

  const handleYearChange = (value) => {
    setPatchyear(value);
    fetchData(Patchmonth, value, 1);
    setCurrentPage(1); // Reset page to 1 on new filter
  };

  // Handle Pagination
  const handlePageChange = (newPage) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    
    fetchData(Patchmonth, Patchyear, newPage)
    .then(() => {
      setIsLoading(false); // Set loading to false once fetch is complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setIsLoading(false); // Ensure loading is set to false even if there's an error
    });
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!isModalOpen);
  
  // console.log("Report Data :", patchReportData?.reportData)

  return (
    <>
    <div className="flex flex-col sm:flex-row h-screen">
       <Sidebar data={user}/>   
       {/* <aside id="patch_management" className=" leftSide fixed top-5 right-2 z-40 w-4/5 bg-white cust_h-56 transition-transform -translate-x-full sm:translate-x-0 p-8" aria-label="patch_management"> */}

       <aside
        id="patch_management"
        className="relative w-full sm:w-4/5 min-h-[calc(100vh-20px)] sm:h-full  overflow-y-auto sm:ml-64  lg:ml-80 customMl"
        
      >
         <div className="bg-white rightSideMain min-h-[calc(100vh-20px)] w-[calc(100%-1px)] overflow-y-auto m-auto float-end ">
        <div className="grid grid-cols-1 sm:grid-rows-3 sm:grid-flow-col gap-4">
          <div className="row-span-3">
            <h1 className="font-semibold border-heading">Patch Management Report</h1></div>
          <div className="row-span-2 col-span-1">
          <div className="flex flex-wrap md:flex-nowrap gap-4 month_wrap">
          <div className="w-full sm:max-w-sm min-w-[200px]">      
              <div className="relative">
                  <select id="month" name="month"
                      className="customSelect w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" onChange={(e) => handleMonthChange(e.target.value)}>
                      <option value="">Select Month</option>
                      {months.map((month, index) => (
                        <option key={index} value={month.id}>
                          {month.month_name}
                        </option>
                        ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="#9D1D96" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>

              <div className="w-full max-w-sm min-w-[200px]">      
              <div className="relative">
                  <select id="year" name="year"
                      className="customSelect w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" onChange={(e) => handleYearChange(e.target.value)}>
                      <option value="">Select Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year.id}>
                          {year.year}
                        </option>
                        ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="#9D1D96" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-2">
        <div className="flex justify-end">
          {user.role_id == '1' && (
            <button className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75" onClick={toggleModal}><span><FileText  className="text-2xl inline-block align-middle mr-2" /></span><span className="inline-block align-middle ">Add Report</span></button>
          )}
              
            </div>
        </div>
        <div className="relative container mt-5 min-h-[calc(70vh-5px)]">
        {isLoading ? ( <div className="loader"></div> ):(              
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Dynamic Content Patch Report */}
          {patchReportData?.reportData?.map((reportData, index) => (
              <div
                key={index}
                className="li_patch_report w-full min-h-24 text-center content-center hover:bg-[#911E82] hover:text-white rounded-lg"
              >
                <Link href={`/patch_reports/${reportData.patch_file_name}`} target="_blank" className="min-h-24 block content-center">
                  <p className="content-center">
                    <span className="block text-3xl"><FileText className="m-auto" /></span>
                    <span className="inline-block align-middle">{reportData.patch_title}</span>
                  </p>
                </Link>
              </div>
            ))
          }
          </div>
          )}
        
          </div>
          {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center relative -bottom-8 right-0 w-full px-4">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 mx-1 rounded disabled:opacity-50 bg-[#911E82] text-white"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === index + 1
                    ? "bg-[#911E82] text-white"
                    : "bg-gray-200 text-[#911E82]"
                } rounded`}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 mx-1 rounded disabled:opacity-50 bg-[#911E82] text-white"
            >
              Next
            </button>
          </div>
        )}
          </div>
       </aside>
       </div>
        {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#911E82] bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            {/* <h2 className="text-xl font-bold mb-4">Patch Report</h2> */}
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="flex">
              <div className="mb-2 w-full p-1">
                <input
                  type="text"
                  id="patch_report_name" name="patch_report_name"
                  className="customInput w-full bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                  placeholder="Enter Patch Report Name" value={formData.patch_report_name} onChange={handleChange} />
              </div>
              </div>

              <div className="flex">
              <div className="mb-2 w-1/2 p-1">
              <div className="relative">
                  <select id="patch_report_month" name="patch_report_month"
                      className="customSelect w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" value={formData.patch_report_month}  onChange={handleChange}>
                      <option value="">Select Month</option>
                      {months.map((month, index) => (
                        <option key={index} value={month.id}>
                          {month.month_name}
                        </option>
                        ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="#9D1D96" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>

              <div className="mb-2 w-1/2 p-1">
              <div className="relative">
                  <select id="patch_report_year" name="patch_report_year"
                      className="customSelect w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" value={formData.patch_report_year}  onChange={handleChange}>
                      <option value="">Select Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year.id}>
                          {year.year}
                        </option>
                        ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="#9D1D96" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>
              </div>
              <div className="flex">
              <div className="mb-2 w-full p-1">
              <input
              type="file"
              id="custom-input" name="patch_report_file"
              className="customInput w-full bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded p-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
              onChange={handleFileChange}
              hidden
            />
            <label
              htmlFor="custom-input"
              className="customInput customInputR w-1/3 bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded  transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md cursor-pointer inline-block"
            >
              Choose file
            </label>
            <label className="customInput customInputL w-2/3 bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md inline-block">{selectedFile ? selectedFile.name : 'No file selected'}</label> 
              </div>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75"
                >
                  CLOSE
                  {/* <FiXOctagon /> */}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75  ms-1"
                >
                  Submit
                </button>
              </div>
              {successMessage && <p className="successMessage text-center text-[green] mt-2">{successMessage}</p>}
            </form>
          </div>
        </div>
        
      )}
    </>
  );
}

export default withAuth(Patch_Management);
