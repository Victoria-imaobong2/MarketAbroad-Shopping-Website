"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPortal() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB constraint

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File exceeds the strict 4MB upload limit.");
      setFileName(null);
      e.target.value = "";
      return;
    }

    setFileError(null);
    setFileName(file.name);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
        <p className="text-xs text-slate-500">Manage catalog inventory and proof-of-delivery records.</p>
      </div>

      {/* Stock Management Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
          Dynamic Inventory Update
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Canvas Sneaker"
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Price (₦)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="35000"
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Available Stock Units</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* 4MB Image Upload Requirement */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Product Media (Max 4MB)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition">
            <UploadCloud className="mx-auto text-slate-400 mb-2" size={28} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 cursor-pointer"
            />
            {fileName && (
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center justify-center gap-1">
                <CheckCircle size={14} /> Ready: {fileName}
              </p>
            )}
            {fileError && (
              <p className="text-xs text-red-600 font-medium mt-2 flex items-center justify-center gap-1">
                <AlertCircle size={14} /> {fileError}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
        >
          Save to Database
        </button>
      </div>
    </div>
  );
}