import { useState } from "react";
import { useContacts } from "../hooks/useContacts";
import { useNavigate, useParams } from "@tanstack/react-router";

const Sidebar = () => {
  const { data: contacts } = useContacts();
  const param = useParams({ strict: false });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredContacts = contacts?.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-64 bg-white shadow-md h-screen overflow-auto p-4">
      <h2 className="text-xl mb-4">Contacts</h2>
      <input
        type="text"
        placeholder="Search Contacts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md text-white"
      />
      <ul className="space-y-2">
        {filteredContacts?.map((contact) => (
          <li
            key={contact.id}
            className={`p-2 rounded-md cursor-pointer hover:bg-blue-100 ${
              param?.id === contact.id && "text-red-400"
            }`}
            onClick={() => navigate({ to: `/contact/${contact.id}` })}
          >
            {contact.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
