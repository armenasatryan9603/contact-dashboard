import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../api/contacts";
import { Contact } from "../types";

export const useContacts = () => {
  return useQuery<Contact[], Error>({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });
};
