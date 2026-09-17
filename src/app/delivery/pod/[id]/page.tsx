"use client";

import { useRef, useState, use } from "react";
import { PenTool, CheckCircle, RotateCcw, Camera } from "lucide-react";

export default function ProofOfDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    const signatureBase64 = canvas ? canvas.toDataURL("image/png") : null;

    try {
      const res = await fetch("/api/delivery/pod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          signature: signatureBase64,
          photo: photoPreview,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Failed to submit proof of delivery.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle className="mx-auto text-emerald-600 mb-3" size={48} />
        <h1 className="text-xl font-bold text-slate-800">Delivery Verified</h1>
        <p className="text-xs text-slate-500 mt-1">Proof of delivery recorded for order #{id}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Proof of Delivery (POD)</h1>
        <p className="text-xs text-slate-500">Order ID: #{id}</p>
      </div>

      {/* Recipient Signature Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <PenTool size={14} className="text-blue-600" />
            Recipient Signature
          </label>
          <button
            type="button"
            onClick={clearSignature}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <RotateCcw size={12} /> Clear
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden touch-none bg-slate-50">
          <canvas
            ref={canvasRef}
            width={400}
            height={160}
            className="w-full bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>

      {/* Parcel Drop-off Photo Proof */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Camera size={14} className="text-blue-600" />
          Parcel Drop-off Photo Proof
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer"
        />
        {photoPreview && (
          <img src={photoPreview} alt="Drop-off proof" className="w-full h-40 object-cover rounded-lg border mt-2" />
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!hasSigned && !photoPreview}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg text-sm transition"
      >
        Confirm & Finalize Delivery
      </button>
    </div>
  );
}