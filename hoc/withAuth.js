import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If the user is not authenticated, redirect to login page
      if (!isLoading && !user) {
        router.replace("/"); // Use replace to avoid reloading the page
      }
    }, [user, isLoading, router]);

    // Display a loading indicator while user data is being fetched
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    // Only render the WrappedComponent if the user is authenticated
    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
