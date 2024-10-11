"use client"; // Ensure this component can use client-side features
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUser, FaCalendarAlt, FaTag, FaHashtag } from "react-icons/fa"; // Importing React Icons
import moment from "moment";

const CustomerDetail = () => {
  const { id } = useParams(); // Get dynamic route parameters
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/members/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching customer data");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomer();
  }, [id]); // Fetch data when id changes

  if (!customer) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div className="flex flex-col  items-center min-h-screen mt-20">
      <h2 className="text-2xl font-bold mb-4">Customer Details</h2>{" "}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-lg w-full transform transition-transform hover:scale-105">
        {" "}
        <div className="flex items-center mb-4">
          <FaHashtag className="mr-2" /> {/* Icon for member number */}
          <p>
            <strong>Member Number:</strong> {customer.memberNumber}{" "}
            {/* Display member number */}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <FaUser className="mr-2" />
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="mr-2" />
          <p>
            <strong>Date of Birth:</strong>{" "}
            {moment(customer.dateOfBirth).format("DD/MM/YYYY")}{" "}
            {/* Format date here */}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <FaTag className="mr-2" />
          <p>
            <strong>Interests:</strong> {customer.interests.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
