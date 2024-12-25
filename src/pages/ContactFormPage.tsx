import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContacts, createContact, updateContact } from "../api/contacts";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Contact } from "../types";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  image: z.string().optional(),
});

const ContactFormPage = () => {
  const { id } = useParams({ from: "/edit/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = id && id !== "new";

  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const existingContact = contacts?.find((c) => c.id === id);

  const mutation = useMutation({
    mutationFn: isEditMode
      ? (data: any) => updateContact(id, data.value)
      : (data: any) => createContact(data.value),
    onSuccess: (data: Contact) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate({ to: "/contact/$id", params: { id: data.id } });
    },
  });

  const form = useForm({
    defaultValues: {
      name: existingContact?.name || "",
      username: existingContact?.username || "",
      email: existingContact?.email || "",
      image: existingContact?.image || "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
    onSubmitInvalid: (values) => {
      const result = ContactSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors;
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setFieldValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <div className="p-6 w-3/4">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Contact" : "Create Contact"}
      </h2>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-4 p-4 bg-white shadow-md rounded-lg"
      >
        <form.Field
          name="name"
          children={(field) => (
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="text-white w-full border p-2 rounded-md"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.map((error, idx) => (
                  <p key={idx} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
            </div>
          )}
        />
        <form.Field
          name="username"
          children={(field) => (
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="text-white w-full border p-2 rounded-md"
              />
            </div>
          )}
        />
        <form.Field
          name="email"
          children={(field) => (
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="text-white w-full border p-2 rounded-md"
              />
            </div>
          )}
        />
        <form.Field
          name="image"
          children={(field) => (
            <div>
              <label className="block mb-1 font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded-md"
              />
              {field.state.value && (
                <img
                  src={field.state.value}
                  alt="Preview"
                  className="mt-2 w-32 h-24 object-cover rounded-md"
                />
              )}
            </div>
          )}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {isEditMode ? "Update Contact" : "Create Contact"}
        </button>
      </form>
    </div>
  );
};

export default ContactFormPage;
