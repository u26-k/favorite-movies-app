STEP 1 — Create Backend Folder

In your main project:

favorite-media-app/
 ├─ backend/
 └─ frontend/

Now open a terminal in the backend/ folder and run:

cd backend
npm init -y
npm install express mongoose cors dotenv nodemon


---

🧩 STEP 2 — Create Folder Structure

Inside backend/, create this structure:

backend/
 ├─ src/
 │   ├─ config/
 │   │   └─ db.js
 │   ├─ models/
 │   │   └─ Entry.js
 │   ├─ controllers/
 │   │   └─ entryController.js
 │   ├─ routes/
 │   │   └─ entryRoutes.js
 │   └─ server.js
 ├─ .env
 └─ package.json


---

🧩 STEP 3 — Add .env

Inside backend/, create a file named .env
Paste your MongoDB connection string (replace with your real one):

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/favmedia
PORT=5000


---

🧩 STEP 4 — Add Code Files

📄 src/config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(✅ MongoDB Connected: ${conn.connection.host});
  } catch (error) {
    console.error(❌ Error: ${error.message});
    process.exit(1);
  }
};

export default connectDB;


---

📄 src/models/Entry.js

import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["Movie", "TV Show"], required: true },
    director: { type: String },
    budget: { type: Number },
    location: { type: String },
    duration: { type: String },
    yearOrTime: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Entry", entrySchema);


---

📄 src/controllers/entryController.js

import Entry from "../models/Entry.js";

// ➕ Create
export const createEntry = async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📄 Read (with pagination for infinite scroll)
export const getEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      Entry.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Entry.countDocuments(),
    ]);

    res.json({ entries, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏ Update
export const updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete
export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


---

📄 src/routes/entryRoutes.js

import express from "express";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/entryController.js";

const router = express.Router();

router.post("/", createEntry);
router.get("/", getEntries);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;


---

📄 src/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import entryRoutes from "./routes/entryRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Favorite Movies & TV Shows API running...");
});

app.use("/api/entries", entryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(🚀 Server running on port ${PORT}));


---

🧩 STEP 5 — Update package.json

Edit your backend/package.json and add this inside:

"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}


---

🧩 STEP 6 — Run the Backend

Run this inside the backend folder:

npm run dev

If everything works, you’ll see:

✅ MongoDB Connected: cluster0....
🚀 Server running on port 5000

✅ Test in your browser: Open → http://localhost:5000/api/entries
You should see an empty array like:

{ "entries": [], "total": 0 }


---

🧩 STEP 7 — Connect Frontend + Backend

Your frontend .env file should already have:

VITE_API_URL=http://localhost:5000/api

Now when you run:

npm run dev

in the frontend folder, both will connect.

STEP 1 — Open Frontend Folder

👉 Open your VS Code or editor
Then open the folder:

favorite-media-app/frontend

If you haven’t yet created it:

npm create vite@latest frontend --template react
cd frontend
npm install


---

🧩 STEP 2 — Set Up Tailwind CSS

Run these commands inside the frontend folder:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Now open these files and paste:

📄 tailwind.config.js

Replace everything with:

export default {
  content: ["./index.html", "./src//*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}

📄 src/index.css

Delete all content, then paste this:

@tailwind base;
@tailwind components;
@tailwind utilities;


---

🧩 STEP 3 — Create .env file

Inside the frontend/ folder (not in src):

> 📄 .env



VITE_API_URL=http://localhost:5000/api


---

🧩 STEP 4 — Clean Up Files

Delete:

src/App.css
src/assets/

Then open:

📄 src/App.jsx

Delete everything inside and paste this:

import React from 'react';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Favorite Movies & TV Shows</h1>
        <Dashboard />
      </div>
    </div>
  );
}


---

🧩 STEP 5 — Create These Files

Inside src/, create these folders and files:

src/
 ├─ api.js
 ├─ pages/
 │   └─ Dashboard.jsx
 └─ components/
     ├─ EntryTable.jsx
     ├─ EntryRow.jsx
     └─ EntryModal.jsx

Now paste the code below in each one 👇


---

📄 src/api.js

import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const fetchEntries = (page = 1, limit = 20) =>
  API.get(/entries?page=${page}&limit=${limit});

export const createEntry = (data) => API.post('/entries', data);
export const updateEntry = (id, data) => API.put(/entries/${id}, data);
export const deleteEntry = (id) => API.delete(/entries/${id});


---

📄 src/pages/Dashboard.jsx

import React, { useState } from 'react';
import EntryTable from '../components/EntryTable';
import EntryModal from '../components/EntryModal';

export default function Dashboard(){
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const openNew = () => { setEditing(null); setOpen(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>List of entries — infinite scroll supported</div>
        <button onClick={openNew} className="px-3 py-1 rounded bg-indigo-600 text-white">Add New</button>
      </div>
      <EntryTable onEdit={(entry)=>{ setEditing(entry); setOpen(true); }} />
      {open && <EntryModal entry={editing} onClose={()=>setOpen(false)} />}
    </div>
  );
}


---

📄 src/components/EntryTable.jsx

import React, { useEffect, useRef, useState } from 'react';
import { fetchEntries, deleteEntry } from '../api';
import EntryRow from './EntryRow';

export default function EntryTable({ onEdit }) {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();

  const load = async (p=1) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchEntries(p, 20);
      const { entries: items, total } = res.data;
      setEntries(prev => p === 1 ? items : [...prev, ...items]);
      setTotal(total);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(1); }, []);

  useEffect(()=>{
    if (!observerRef.current) return;
    const node = observerRef.current;
    const io = new IntersectionObserver((entriesObserved) => {
      entriesObserved.forEach(entry => {
        if (entry.isIntersecting && !loading) {
          const nextPage = page + 1;
          if (entries.length < total) load(nextPage);
        }
      });
    }, { rootMargin: '200px' });
    io.observe(node);
    return () => io.disconnect();
  }, [observerRef.current, page, loading, total, entries.length]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await deleteEntry(id);
      setEntries(e => e.filter(x => x._id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  return (
    <div className="bg-white shadow rounded overflow-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Director</th>
            <th className="p-2 text-left">Budget</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Duration</th>
            <th className="p-2 text-left">Year/Time</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <EntryRow key={e._id} entry={e} onEdit={()=>onEdit(e)} onDelete={()=>handleDelete(e._id)} />
          ))}
        </tbody>
      </table>
      <div ref={observerRef} style={{height: 1}} />
      {loading && <div className="p-4 text-center">Loading...</div>}
    </div>
  );
}


---

📄 src/components/EntryRow.jsx

import React from 'react';

export default function EntryRow({ entry, onEdit, onDelete }){
  return (
    <tr className="border-t">
      <td className="p-2">{entry.title}</td>
      <td className="p-2">{entry.type}</td>
      <td className="p-2">{entry.director || '-'}</td>
      <td className="p-2">{entry.budget ? ₹ ${entry.budget} : '-'}</td>
      <td className="p-2">{entry.location || '-'}</td>
      <td className="p-2">{entry.duration || '-'}</td>
      <td className="p-2">{entry.yearOrTime || '-'}</td>
      <td className="p-2">
        <button onClick={onEdit} className="mr-2 text-sm px-2 py-1 border rounded">Edit</button>
        <button onClick={onDelete} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
      </td>
    </tr>
  );
}


---

📄 src/components/EntryModal.jsx

import React, { useEffect, useState } from 'react';
import { createEntry, updateEntry } from '../api';

export default function EntryModal({ entry, onClose }) {
  const [form, setForm] = useState({
    title: '', type: 'Movie', director: '', budget: '', location: '', duration: '', yearOrTime: '', description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ if (entry) setForm({...entry}); }, [entry]);
  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      if (entry && entry._id) {
        await updateEntry(entry._id, form);
      } else {
        await createEntry(form);
      }
      window.location.reload();
    } catch (err) {
      alert('Save failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">{entry ? 'Edit Entry' : 'Add New Entry'}</h3>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="title" required placeholder="Title" value={form.title} onChange={handleChange} className="p-2 border rounded" />
          <select name="type" value={form.type} onChange={handleChange} className="p-2 border rounded">
            <option>Movie</option>
            <option>TV Show</option>
          </select>
          <input name="director" placeholder="Director" value={form.director} onChange={handleChange} className="p-2 border rounded" />
          <input name="budget" placeholder="Budget" type="number" value={form.budget || ''} onChange={handleChange} className="p-2 border rounded" />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="p-2 border rounded" />
          <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} className="p-2 border rounded" />
          <input name="yearOrTime" placeholder="Year/Time" value={form.yearOrTime} onChange={handleChange} className="p-2 border rounded" />
          <textarea name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} className="p-2 border rounded col-span-2" />
        </div>

        <div className="mt-3 flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}


---

🧩 STEP 6 — Run Your Frontend

Run this inside the frontend folder:

npm run dev

Then open the link shown in the terminal — usually: 👉 http://localhost:5173

https://08f4cb3d-fb66-47f3-bcc2-62735113c72e.web.createdevserver.com/












