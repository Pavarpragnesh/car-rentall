import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

const Footer = () => {
  const { axios } = useAppContext();

  const [showTerms, setShowTerms] = useState(false);
  const [termsContent, setTermsContent] = useState("");

  // ✅ Fetch Terms
  const fetchTerms = async () => {
    try {
      const { data } = await axios.get("/api/terms");
      if (data.success) {
        setTermsContent(data.terms?.content || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showTerms) fetchTerms();
  }, [showTerms]);

  // ✅ Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowTerms(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* ================= FOOTER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-40 text-sm text-gray-500"
      >
        <div className="flex flex-wrap justify-between items-start gap-10 pb-8 border-b border-gray-200">
          
          {/* LEFT */}
          <div className="max-w-sm">
            <img src={assets.logo} alt="logo" className="h-9" />

            <p className="mt-4 leading-relaxed text-gray-500">
              Premium car rental service with a wide selection of luxury and
              everyday vehicles for all your driving needs.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <img src={assets.facebook_logo} className="w-5 cursor-pointer hover:scale-110 transition" />
              <img src={assets.instagram_logo} className="w-5 cursor-pointer hover:scale-110 transition" />
              <img src={assets.twitter_logo} className="w-5 cursor-pointer hover:scale-110 transition" />
              <img src={assets.gmail_logo} className="w-5 cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap justify-between w-full md:w-1/2 gap-10">
            
            {/* Quick Links */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 uppercase">
                Quick Links
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                <li className="hover:text-black cursor-pointer">Home</li>
                <li className="hover:text-black cursor-pointer">Browse Cars</li>
                <li className="hover:text-black cursor-pointer">List Your Car</li>
                <li className="hover:text-black cursor-pointer">About Us</li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 uppercase">
                Resources
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                <li className="hover:text-black cursor-pointer">Help Center</li>

                <li>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="hover:text-black transition"
                  >
                    Terms of Service
                  </button>
                </li>

                <li className="hover:text-black cursor-pointer">Privacy Policy</li>
                <li className="hover:text-black cursor-pointer">Insurance</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 uppercase">
                Contact
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                <li>1234 Luxury Drive</li>
                <li>San Francisco, CA</li>
                <li>+1 234 567890</li>
                <li>info@example.com</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between py-6">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </p>

          <ul className="flex items-center gap-4 text-gray-500">
            <li className="hover:text-black cursor-pointer">Privacy</li>
            <li>|</li>

            <li>
              <button
                onClick={() => setShowTerms(true)}
                className="hover:text-black"
              >
                Terms
              </button>
            </li>

            <li>|</li>
            <li className="hover:text-black cursor-pointer">Cookies</li>
          </ul>
        </div>
      </motion.div>

      {/* ================= MODAL ================= */}
      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowTerms(false)}
        >
          {/* MODAL BOX */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Terms & Conditions
              </h2>

              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 overflow-y-auto text-gray-700 leading-relaxed text-sm space-y-3">
              {termsContent ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: termsContent }}
                />
              ) : (
                <p className="text-center text-gray-400">
                  Loading Terms...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;