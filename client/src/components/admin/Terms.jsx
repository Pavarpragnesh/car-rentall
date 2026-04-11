import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Title from "../../components/owner/Title";

const Terms = () => {
  const { axios } = useAppContext();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ✅ Fetch Terms
  const fetchTerms = async () => {
    try {
      setFetching(true);

      const { data } = await axios.get("/api/terms");

      if (data?.success && data?.terms?.content) {
        setContent(data.terms.content);
      } else {
        setContent("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load terms");
    } finally {
      setFetching(false);
    }
  };

  // ✅ Save Terms
  const saveTerms = async () => {
    // Remove HTML tags for validation
    const plainText = content.replace(/<(.|\n)*?>/g, "").trim();

    if (!plainText) {
      toast.error("Please write some content");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/terms/save", { content });

      if (data?.success) {
        toast.success("Terms & Conditions saved successfully!");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  // ✅ Loading UI
  if (fetching) {
    return (
      <div className="p-6">
        <Title title="Terms & Conditions" subTitle="Manage platform terms" />
        <div className="mt-10 text-center text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      <Title title="Terms & Conditions" subTitle="Manage platform terms" />

      {/* ✅ Editor */}
      <div className="mt-6 bg-white border rounded-xl shadow-sm p-4">
        <Editor
          apiKey='iia9ovrkmv7svda2u0dqljh8xclj5a1gg0qo87no2g7g88l7'
          value={content}
          onEditorChange={(newValue) => setContent(newValue)}
          init={{
            height: 500,
            menubar: true,
            branding: false,

            plugins: [
              "advlist autolink lists link image charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table help wordcount",
            ],

            toolbar:
              "undo redo | formatselect | bold italic underline | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | link image | removeformat",

            content_style:
              "body { font-family:Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>

      {/* ✅ Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={saveTerms}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={fetchTerms}
          className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      {/* ✅ Info */}
      <p className="text-xs text-gray-500 mt-3">
        Content is stored as HTML and will be displayed on the user side.
      </p>
    </div>
  );
};

export default Terms;