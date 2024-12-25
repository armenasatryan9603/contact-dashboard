import axios from "axios";
import { Contact } from "../types";

const API_URL = "http://localhost:3001/contacts";

// Get All Contacts
export const getContacts = async (): Promise<Contact[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a New Contact
export const createContact = async (contact: Omit<Contact, "id">) => {
  const response = await axios.post(API_URL, contact);
  return response.data;
};

// Update a Contact
export const updateContact = async (id: string, contact: Partial<Contact>) => {
  const response = await axios.put(`${API_URL}/${id}`, contact);
  return response.data;
};

// Delete a Contact
export const deleteContact = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
