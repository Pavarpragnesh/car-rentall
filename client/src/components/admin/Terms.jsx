import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Title from "../../components/owner/Title";

const Terms = () => {

  const { axios } = useAppContext();
  const [content, setContent] = useState("");

  const fetchTerms = async () => {
    try {
      const { data } = await axios.get("/api/terms");

      if (data.success && data.terms) {
        setContent(data.terms.content);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveTerms = async () => {
    try {
      const { data } = await axios.post("/api/terms/save", { content });

      if (data.success) {
        toast.success("Saved successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="p-6">
      <Title title="Terms & Conditions" subTitle="Manage platform terms" />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
        className="w-full border p-3 mt-4 rounded"
        placeholder="Write terms and conditions..."
      />

      <button
        onClick={saveTerms}
        className="mt-4 px-6 py-2 bg-primary text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Terms;