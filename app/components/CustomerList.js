import moment from "moment/moment";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Importing icons

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // Track customer being edited
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    interests: "",
  });

  // Fetch customers from the backend API when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/members"); // Assuming your backend API route is /api/members
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Function to generate a random member number
  const generateRandomMemberNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  // Handle modal form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to open the modal for adding or editing a customer
  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        dateOfBirth: customer.dateOfBirth.split("T")[0], // Handle date formatting
        interests: customer.interests.join(", "), // Handle interests as a comma-separated string
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        dateOfBirth: "",
        interests: "",
      });
    }
    setShowModal(true);
  };

  // Function to add or update customer (POST or PATCH request)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include _id in the customerData for the PATCH request
    const customerData = {
      _id: editingCustomer ? editingCustomer._id : null, // Add this line
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      interests: formData.interests
        .split(",")
        .map((interest) => interest.trim()),
      memberNumber: editingCustomer
        ? editingCustomer.memberNumber
        : generateRandomMemberNumber(), // Generate if adding new
    };

    try {
      if (editingCustomer) {
        // Edit (PATCH request)
        const response = await fetch(`/api/members`, {
          // Change the endpoint to just /api/members
          method: "PATCH", // Keep PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const updatedCustomer = await response.json();
        setCustomers(
          customers.map((customer) =>
            customer._id === editingCustomer._id ? updatedCustomer : customer
          )
        );
      } else {
        // Add (POST request)
        const response = await fetch("/api/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        });
        const newCustomer = await response.json();
        setCustomers([...customers, newCustomer]);
      }
      setShowModal(false); // Close modal after submitting
    } catch (error) {
      console.error("Error submitting customer data:", error);
    }
  };

  // Function to delete a customer (DELETE request)
  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      try {
        await fetch(`/api/members/${id}`, {
          method: "DELETE",
        });
        setCustomers(customers.filter((customer) => customer._id !== id));
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Customers</h2>

      {/* Add Customer Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 flex items-center"
        onClick={() => openModal()}
      >
        <FaPlus className="mr-2" /> Add Customer
      </button>

      {/* Customer List */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2">Name</th>
            <th className="border-b py-2">Interests</th>
            <th className="border-b py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td className="border-b py-2">
                {" "}
                <Link href={`/customers/${customer._id}`}>
                  <span className="hover:underline">{customer.name}</span>
                </Link>
              </td>
              <td className="border-b py-2">
                {moment(customer.dateOfBirth).format("DD/MM/YYYY")}{" "}
                {/* Format date here */}
              </td>
              <td className="border-b py-2">{customer.interests.join(", ")}</td>
              <td className="border-b py-2">
                <div className="flex items-center">
                  <button
                    className="bg-green-500 text-white px-2 py-1 mx-1 flex items-center rounded-md"
                    onClick={() => openModal(customer)}
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-2 py-1 mx-1 flex items-center rounded-md"
                    onClick={() => handleDeleteCustomer(customer._id)}
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit Customer */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-bold mb-4">
              {editingCustomer ? "Edit Customer" : "Add Customer"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2"
                >
                  {editingCustomer ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
