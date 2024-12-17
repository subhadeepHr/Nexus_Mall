"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react"; // Import React explicitly
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/AuthContext";
// import withAuth from "@/lib/withAuth";
import withAuth from "@/lib/withAuth";
import { FilePenLine, Trash2, UserPlus, View, ArrowUpNarrowWide, ArrowDownWideNarrow   } from 'lucide-react';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  // Input,
  // Button,
  // DropdownTrigger,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  // Chip,
  Pagination,
} from "@nextui-org/react";
import api from "@/lib/axios";
import ConfirmDialog from "@/components/ConfirmDialog";

const UserManagement = () => {
  const { user } = useAuth();
  

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

   // Fetch Roles
   useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-roles`
        );
        const data = await response.json();
        setRoles(data.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

    // Fetch user data from API
    const fetchData = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-user`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUsers(data.users); // Update the user list
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, []);

   useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, [fetchData]);

   // Handle search
   const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user).some((value) =>
        value != null && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [users, searchQuery]);

  // Handle sorting
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredUsers, sortConfig]);

// Paginated data
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedUsers.slice(start, end);
  }, [page, rowsPerPage, sortedUsers]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = Math.min(page * rowsPerPage, sortedUsers.length);
  const totalUsers = sortedUsers.length;  

  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  const toggleModal = (type = null, id = null) => {
  
    if (isModalOpen) {
      // Close modal
      setModalOpen(false);
      setModalType(null);
      setSelectedUser(null);
      setFormData({
        user_name: "",
        user_password: "",
        user_password_confirm: "",
        user_email: "",
        user_role: "",
      });
   
    } else {

         // Open modal
         if (type === "add") {
          // For "add", initialize form with empty data
          setFormData({
            user_name: "",
            user_email: "",
            user_password: "",
            user_password_confirm: "",
            user_role: "",
          });
          setModalType(type); // Set modal type to "add"
          setModalOpen(true);  // Open modal
        }else if (type === "edit" && id) {

        api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-user-view/${id}`)
          .then((response) => {
            const userToEdit = response.data;
            console.log("User data for edit:", userToEdit);
            setSelectedUser(userToEdit);
            setFormData({
              user_name: userToEdit.name || "",  // Default to empty string if undefined
              user_email: userToEdit.email || "",  // Default to empty string if undefined
              user_password: "",  // Do not pre-fill password
              user_password_confirm: "",  // Do not pre-fill password confirmation
              user_role: userToEdit.role_id || "", 
            });
            setModalType(type); // Set modal type after data is fetched
            setModalOpen(true);  // Then open modal
          })
          .catch((error) => {
            console.error("There was an error fetching the user data for edit:", error);
          })
          .finally(() => {
            setIsLoading(false); // Ensure loading state is reset after the request completes
          });

      } else if (type === "view" && id) {
        // Fetch user data for view
        console.log("Fetching user data for view...");
        api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/get-user-view/${id}`)
          .then((response) => {
            const userToView = response.data;
            setSelectedUser(userToView);
            setModalType(type); // Set modal type after data is fetched
            setModalOpen(true);  // Then open modal
          })
          .catch((error) => {
            console.error("There was an error fetching the user data for view:", error);
          })
          .finally(() => {
            setIsLoading(false); // Ensure loading state is reset after the request completes
          });
      }
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateAlphabet = (name) =>
    /^[A-Za-z ]+$/.test(name);

  

  const checkPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    if (!/[A-Z]/.test(password)) return "Moderate";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Good";
    return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "user_password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_name) newErrors.user_name = "Name is required.";
    if (!validateAlphabet(formData.user_name)) newErrors.user_name = "Only Alphabet";
    if (!formData.user_email || !validateEmail(formData.user_email))
      newErrors.user_email = "Enter a valid email.";
    if (modalType !== "edit" ){
      if (!formData.user_password)
        newErrors.user_password = "Password is required.";
      if (formData.user_password.length < 8)
        newErrors.user_password = "Password must be at least 8 characters.";
      if (formData.user_password !== formData.user_password_confirm)
        newErrors.user_password_confirm = "Passwords do not match.";
    }
    if (!formData.user_role) newErrors.user_role = "Select a role.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const [formData, setFormData] = useState({
    user_name: "",
    user_password: "",
    user_password_confirm: "",
    user_email: "",
    user_role: "",
  });

  const handleSubmit = async (e) => {
  
    e.preventDefault();
    console.log("Form submitted. Modal Type:", modalType, "Form Data:", formData);
    if (!validateForm(modalType)) return;

    const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        console.log(key, value);
      formDataToSend.append(key, value);
    });

    const method = modalType === "edit" ? "PUT" : "POST";

    const url = modalType === "edit" ? `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/update-user/${selectedUser.id}` : `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/add-user`;
      console.log("API URL:", url, "Method:", method);
    try {
      console.log("Sending request...");
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/add-user`, {
        const response = await fetch(url, {
        method,
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
      });
      console.log("Response received:", response);
      const result = await response.json();
      console.log("Response JSON:", result);
      if (response.ok) {
        setSuccessMessage(
          modalType === "edit" ? "User updated successfully!" : "User added successfully!"
        );
        // 
        fetchData();
        setTimeout(() => {
          toggleModal(); // Close the modal after a delay
        }, 1000); // Adjust the delay if needed (1000ms = 1 second)
      
        // setSelectedUser(null); // Clear selected user after success
      } else {
        setSuccessMessage("Failed to process the request.");
      }
    } catch (error) {
      setSuccessMessage("An error occurred while processing the request.");
    }

    
  };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
  
    // Function to handle the delete click
    const handleDeleteClick = (id) => {
      setMessage('Are you sure you want to delete this user?');
      setUserIdToDelete(id);
      setIsDialogOpen(true);
    };

  // Function to delete the user
  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/delete-user/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('User deleted successfully!');
        setIsSuccess(true);
        fetchData(); // Refresh user data
      } else {
        setMessage(result.message || 'Failed to delete user.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred while deleting the user.');
      setIsSuccess(false);
    } finally {
      // Wait for the message to be updated before closing the dialog
      setTimeout(() => {
        setIsDialogOpen(false); // Close the dialog
      }, 2000); // Delay before closing
    }
  };

  // Function to cancel the deletion
  const handleCancel = () => {
    setIsDialogOpen(false);
  };
  

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>User not found. Redirecting...</p>
      </div>
    );
  }
  const renderModalContent = () => {

    if (modalType === "view" && selectedUser) {
   
      return (
          <>
          <div className="fixed inset-0 bg-[#911E82] bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <div className="flex">
                    <div className="mb-2 w-full p-1">
                      <p className="customInput w-full bg-transparent text-[#911E82] text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md">{selectedUser.name}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mb-2 w-full p-1">
                      <p className="customInput w-full bg-transparent text-[#911E82] text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mb-2 w-full p-1">
                      <p className="customInput w-full bg-transparent text-[#911E82] text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md">{selectedUser.role}</p>
                    </div>
                  </div>
           
            <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={() => toggleModal()}
                  className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75"
                >
                  CLOSE
                  {/* <FiXOctagon /> */}
                </button>
                </div>
            </div>
            </div>
          </>
        );
    }
    return(
      <div className="fixed inset-0 bg-[#911E82] bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
    
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="flex">
                <div className="mb-2 w-full p-1">
                  <input
                    type="text"
                    id="user_name" 
                    name="user_name"
                    value={formData.user_name  || ""}
                    placeholder="Enter Name"
                    onChange={handleChange}
                    className="customInput w-full bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                    />
                    {errors.user_name && <p className="error">{errors.user_name}</p>}
                </div>
              </div>
              <div className="flex">
                <div className="mb-2 w-full p-1">
                  <input
                    type="email"
                    id="user_email" 
                    name="user_email"
                    value={formData.user_email  || ""}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    className="customInput w-full bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                   />
                   {errors.user_email && <p className="error">{errors.user_email}</p>}
                </div>
              </div>
              { modalType !== "edit" && (
              <div className="flex">
              <div className="mb-2 w-1/2 p-1">
                <input
                  type="password"
                  id="user_password"
                  name="user_password"
                  placeholder="Enter Password"
                  value={formData.user_password  || ""}
                  onChange={handleChange}
                  className="customInput w-full bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                 />
                 <p className="text-xs mb-0">Password Strength: {passwordStrength}</p>
                  {errors.user_password && (
                    <p className="error">{errors.user_password}</p>
                   )}
                    
              </div>
          
              <div className="mb-2 w-1/2 p-1">
                <input
                  type="password"
                  name="user_password_confirm"
                  placeholder="Confirm Password"
                  value={formData.user_password_confirm  || ""}
                  onChange={handleChange}
                  className="customInput w-full bg-transparent placeholder:text-[#911E82] text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                   />
                  {errors.user_password_confirm && (
                    <p className="error">{errors.user_password_confirm}</p>
                  )}
              </div>
              </div>
                )}
              <div className="flex">
              <div className="mb-2 w-1/2 p-1">
              <div className="relative">
                  <select
                    name="user_role"
                    value={formData.user_role}
                    onChange={handleChange}
                      className="customSelect w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" >
                      <option value="">Select Roles</option>
                      {roles.map((role, index) => (
                        <option key={index} value={role.id}>
                          {role.role_name}
                        </option>
                        ))}
                  </select>
                  {errors.user_role && <p className="error">{errors.user_role}</p>}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="#9D1D96" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>
              </div>
              
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={() => toggleModal()}
                  className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75"
                >
                  CLOSE
                  {/* <FiXOctagon /> */}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75  ms-1"
                >
                  {modalType === "edit" ? "Update" : "Submit"}
                </button>
              </div>
              {successMessage && <p className="successMessage text-center text-[green] mt-2">{successMessage}</p>}
            </form>
          </div>
        </div>
    )
  }
 
  return (
    <>
      <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar data={user} />
     
      {/* <aside
        id="patch_management"
        className="leftSide fixed top-5 right-2 z-40 w-4/5 bg-white h-[calc(100vh-40px)] transition-transform -translate-x-full sm:translate-x-0 p-7"
        
      > */}
      <aside
        id="user_management"
        className="relative w-full sm:w-4/5 min-h-[calc(100vh-20px)] sm:h-full  overflow-y-auto sm:ml-64 lg:ml-80 customMl"
        
      >
        <div className="bg-white rightSideMain min-h-[calc(100vh-20px)] w-[calc(100%-1px)] overflow-y-auto m-auto float-end ">
        <div className="grid grid-rows-3 grid-flow-col gap-4">
          <div className="row-span-3">
            <h1 className="font-semibold border-heading">User Management</h1>
          </div>
        </div>
        <div className="container">
          <div className="flex justify-end">
            {user?.role_id == "1" && (
              <button
                className="py-2 px-5 font-semibold rounded-full shadow-md bg-[#F0E3EF] hover:bg-[#911E82] text-[#911E82] hover:text-[#fff] focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75"
                onClick={() => toggleModal('add')}
              >
                 <UserPlus className="inline-block align-middle mr-2"/>
                <span className="inline-block align-middle">Add Role</span>
              </button>
            )}
          </div>
        </div>
        <div className="container mt-5 ">
        
          {isLoading ? (
           <div className=" loader"></div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
           <div className="h-full">
             <div className="w-full  relative">
              <div className="grid grid-rows-3 grid-flow-col gap-4">
                  <div className="row-span-3  mb-2 text-gray-600 ">
                      Showing {startIndex}–{endIndex} of {totalUsers}
                    </div>
                    <div className="row-span-2 col-span-2 mb-2 text-gray-600 col-end-7 col-span-2">
                    <input
                      type="text"
                      placeholder="Search by Name, Role, Email "
                      className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </div>
                </div>
          </div>
          <Table
            className="customTable"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={Math.ceil(sortedUsers.length / rowsPerPage)}
                  onChange={setPage}
                />
              </div>
            }
          >
            <TableHeader className="customTableHeader">
              <TableColumn className="iconH" key="name" onClick={() => handleSort("name")}>
                NAME {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? <ArrowUpNarrowWide  /> : <ArrowDownWideNarrow  />) : ""}
              </TableColumn>
              <TableColumn className="iconH" key="role" onClick={() => handleSort("role")}>
                ROLE {sortConfig.key === "role" ? (sortConfig.direction === "asc" ?  <ArrowUpNarrowWide  /> : <ArrowDownWideNarrow  />) : ""}
              </TableColumn>
              <TableColumn className="iconH" key="email" onClick={() => handleSort("email")}>
                EMAIL {sortConfig.key === "email" ? (sortConfig.direction === "asc" ?  <ArrowUpNarrowWide  /> : <ArrowDownWideNarrow  />) : ""}
              </TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id} className="">
                  <TableCell className="p-2 ">{item.name}</TableCell>
                  <TableCell className="p-2 ">{item.role}</TableCell>
                  <TableCell className="p-2">{item.email}</TableCell>
                 
                  <TableCell className="p-2">
                    <button onClick={() => toggleModal('view', item.id)} className="text-blue-500 mr-4">
                      <View />
                    </button>
                    {user?.role_id == "1" && (
                      <>
                      
                        <button onClick={() => toggleModal('edit', item.id)} className="text-green-500 mr-4">
                        <FilePenLine />
                        </button>
                        <button onClick={() => handleDeleteClick(item.id)} className="text-red-500 mr-4">
                        <Trash2 /> 
                        </button>
                      </>
                    )}
                  </TableCell> 
                </TableRow>
              )}
            </TableBody>
          </Table>
           </div>
          )}

        </div>
        {isDialogOpen && (
        <ConfirmDialog
          // message="Are you sure you want to delete this user?"
          message={message}
          onConfirm={handleDelete}
          onCancel={handleCancel}
          isSuccess={isSuccess}
        />
      )}
      
      {/* </aside> */}
       {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <button onClick={() => toggleModal()}>Close</button>
              {renderModalContent()}
            </div>
          </div>
        )}
        </div>
        </aside>

        </div>
    </>
  );
};

export default withAuth(UserManagement);
