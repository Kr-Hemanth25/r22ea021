"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logger } from "../../../loginmiddleware/loger";

// Simple Button
const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

// Simple Card
const Card = ({ children, className }) => (
  <div className={`bg-white ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function Home() {
  const [urls, setUrls] = useState([
    { url: "", validity: 30, shortcode: "", sitename: "" },
  ]);
  const [results, setResults] = useState([]);
  const [savedShortcodes, setSavedShortcodes] = useState([]);

  // Load shortcodes array from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("shortcodes");
    if (stored) setSavedShortcodes(JSON.parse(stored));

  // Log page load event
  Logger.debug('Frontend', 'page', 'Home page loaded');
  }, []);

  const handleChange = (i, field, value) => {
    const newUrls = [...urls];
    newUrls[i][field] = value;
    setUrls(newUrls);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([
        ...urls,
        { url: "", validity: 30, shortcode: "", sitename: "" },
      ]);
    }
  };

  const shortenUrls = async () => {
    const responses = await Promise.all(
      urls.map(async (item) => {
        if (!item.url) return null;
        const res = await fetch("http://localhost:5000/shorturls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const data = await res.json();

        if (item?.shortcode) {
          const entry = { shortcode: item.shortcode, sitename: item.sitename };
          const updatedCodes = [...savedShortcodes, entry];
          setSavedShortcodes(updatedCodes);
          localStorage.setItem("shortcodes", JSON.stringify(updatedCodes));
        }

        return { ...data, sitename: item.sitename };
      })
    );

    setResults(responses.filter((r) => r));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-10">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-extrabold text-red-600 mb-8"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🔗 URL Shortener
      </motion.h1>

      {/* Input Fields */}
      <div className="w-full max-w-2xl space-y-4">
        {urls.map((item, i) => (
          <AnimatePresence key={i}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-lg rounded-2xl border border-red-200">
                <CardContent className="flex flex-wrap gap-2 p-4">
                  {/* Website Name */}
                  <input
                    placeholder="Website name (e.g. Google)"
                    value={item.sitename}
                    onChange={(e) =>
                      handleChange(i, "sitename", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 w-40 focus:outline-none focus:ring-2 focus:ring-red-400 text-red-600"
                  />
                  <input
                    placeholder="Enter long URL"
                    value={item.url}
                    onChange={(e) => handleChange(i, "url", e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-400 text-red-600"
                  />
                  <input
                    type="number"
                    placeholder="Validity (minutes)"
                    value={item.validity}
                    onChange={(e) =>
                      handleChange(i, "validity", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 w-28 focus:outline-none focus:ring-2 focus:ring-red-400 text-red-600"
                  />
                  <input
                    placeholder="Custom shortcode"
                    value={item.shortcode}
                    onChange={(e) =>
                      handleChange(i, "shortcode", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 w-32 focus:outline-none focus:ring-2 focus:ring-red-400 text-red-600"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button
          onClick={addField}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-xl shadow-md transition"
        >
          + Add URL
        </Button>
        <Button
          onClick={shortenUrls}
          className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-xl shadow-md transition"
        >
          🚀 Shorten
        </Button>
      </div>

      {/* Results */}
      <motion.div
        className="mt-10 w-full max-w-2xl space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {results.map((r, i) => (
          <Card
            key={i}
            className="border border-gray-200 shadow-md rounded-2xl hover:shadow-lg transition"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <div>
                <p className="text-gray-700">
                  {r.sitename && (
                    <span className="font-semibold">{r.sitename}: </span>
                  )}
                  <a
                    href={r.shortLink}
                    target="_blank"
                    className="text-red-600 font-semibold hover:underline"
                  >
                    {r.shortLink}
                  </a>
                </p>
                <p className="text-gray-500 text-sm">
                  Expiry: {new Date(r.expiry).toLocaleString()}
                </p>
              </div>

              {r.shortcode && (
                <button
                  onClick={() =>
                    (window.location.href = `/stats/${r.shortcode}`)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Stats for {r.sitename || r.shortcode}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Persistent Bottom Stats Buttons */}
      {savedShortcodes.length > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          {savedShortcodes.map((entry, idx) => (
            <Button
              key={idx}
              onClick={() => (window.location.href = `/stats/${entry.shortcode}`)}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-2xl shadow-lg transition"
            >
              📊 Stats for {entry.sitename || entry.shortcode}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}



