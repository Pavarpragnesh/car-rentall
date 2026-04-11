import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Title from "../../components/owner/Title";
import car1 from "../../assets/car1.png";

const Offers = () => {
  const { axios } = useAppContext();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    discountType: "flat",
    discountValue: "",
    startDate: "",
    endDate: "",
  });

  // ✅ Fetch Offers
  const fetchOffers = async () => {
    try {
      const { data } = await axios.get("/api/offers/list");
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ✅ Add / Update Offer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.code ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      return toast.error("All fields required");
    }

    try {
      setLoading(true);

      const url = editingId
        ? "/api/offers/update"
        : "/api/offers/add";

      const payload = editingId
        ? { id: editingId, ...form }
        : form;

      const { data } = await axios.post(url, payload);

      if (data.success) {
        toast.success(editingId ? "Offer updated" : "Offer added");

        setForm({
          name: "",
          code: "",
          discountType: "flat",
          discountValue: "",
          startDate: "",
          endDate: "",
        });

        setEditingId(null);
        fetchOffers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const deleteOffer = async (id) => {
    if (!confirm("Delete this offer?")) return;

    try {
      const { data } = await axios.post("/api/offers/delete", { id });

      if (data.success) {
        toast.success("Offer deleted");
        fetchOffers();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ Toggle Active
  const toggleOffer = async (id) => {
    try {
      const { data } = await axios.post("/api/offers/toggle", { id });

      if (data.success) {
        fetchOffers();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  // ✅ Edit
  const editOffer = (offer) => {
    setForm({
      name: offer.name,
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: offer.startDate.slice(0, 16),
      endDate: offer.endDate.slice(0, 16),
    });

    setEditingId(offer._id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="p-6 max-w-6xl">
      <Title title="Offers" subTitle="Manage discount offers" />

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Offer Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Offer Code"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
          className="border p-3 rounded-lg"
        />

        <select
          value={form.discountType}
          onChange={(e) =>
            setForm({ ...form, discountType: e.target.value })
          }
          className="border p-3 rounded-lg"
        >
          <option value="flat">Flat Discount</option>
          <option value="percentage">Percentage</option>
        </select>

        <input
          type="number"
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={(e) =>
            setForm({ ...form, discountValue: e.target.value })
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="datetime-local"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="datetime-local"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium cursor-pointer"
        >
          {loading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Offer"
            : "Add Offer"}
        </button>
      </form>

      {/* ================= LIST ================= */}
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {offers.length === 0 && (
          <p className="text-gray-500">No offers found</p>
        )}

        {offers.map((o) => (
          <div
            key={o._id}
            className="rounded-2xl p-5 shadow-lg text-white relative overflow-hidden group transition-all duration-300 hover:scale-[1.03]"
            style={{
              backgroundImage: `url(${car1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="font-bold text-xl">{o.name}</h3>
              <p className="text-gray-200">{o.code}</p>

              <p className="mt-2 text-lg font-semibold">
                {o.discountType === "flat"
                  ? `₹${o.discountValue} OFF`
                  : `${o.discountValue}% OFF`}
              </p>

              <p className="text-xs text-gray-200 mt-2">
                {new Date(o.startDate).toLocaleString()} <br />
                → {new Date(o.endDate).toLocaleString()}
              </p>

              <p
                className={`mt-2 text-sm font-semibold ${
                  o.isActive ? "text-green-400" : "text-red-400"
                }`}
              >
                {o.isActive ? "Active" : "Inactive"}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => editOffer(o)}
                  className="px-3 py-1 rounded-lg bg-blue-500/80 hover:bg-blue-600 transition cursor-pointer text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteOffer(o._id)}
                  className="px-3 py-1 rounded-lg bg-red-500/80 hover:bg-red-600 transition cursor-pointer text-sm"
                >
                  Delete
                </button>

                <button
                  onClick={() => toggleOffer(o._id)}
                  className="px-3 py-1 rounded-lg bg-gray-500/80 hover:bg-gray-600 transition cursor-pointer text-sm"
                >
                  Toggle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;