import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContacts, deleteContact } from "../api/contacts";
import Modal from "../components/Modal";
import { useState } from "react";

const ContactDetailPage = () => {
  const { id } = useParams({ from: "/contact/$id" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const contact = contacts?.find((c) => c.id === id);

  const deleteMutation = useMutation({
    mutationFn: () => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate({ to: "/" });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setIsModalOpen(false);
  };

  if (!contact) return <div>Contact not found!</div>;

  return (
    <div className="p-4 w-72  mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <img
          src={contact.image}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto"
        />
        <h2 className="text-2xl font-bold text-center mt-4">{contact.name}</h2>
        <p className="text-gray-600 text-center">@{contact.username}</p>
        <p className="mt-2 text-sm text-center">{contact.email}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate({ to: `/edit/${contact?.id}` })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Contact"
        description="Are you sure you want to delete this contact?"
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ContactDetailPage;
