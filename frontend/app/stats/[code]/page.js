"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Stats({ params }) {
  const { code } = params;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/stats/${code}`)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [code]);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.p
          className="text-red-600 font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Loading...
        </motion.p>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-white p-10 text-gray-800 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-red-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Statistics for {code}
      </motion.h1>

      {/* Summary Section */}
      <motion.div
        className="space-y-2 mb-6 text-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p>
          Original URL:{" "}
          <span className="text-red-600 font-semibold">
            {stats.originalUrl}
          </span>
        </p>
        <p>
          Created:{" "}
          <span className="text-red-600 font-semibold">
            {new Date(stats.createdAt).toLocaleString()}
          </span>
        </p>
        <p>
          Expiry:{" "}
          <span className="text-red-600 font-semibold">
            {new Date(stats.expiry).toLocaleString()}
          </span>
        </p>
        <p>
          Total Clicks:{" "}
          <span className="text-red-600 font-semibold">
            {stats.totalClicks}
          </span>
        </p>
      </motion.div>

      {/* Table Section */}
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-red-600 mb-4 text-center">
          Click Details
        </h2>
        <div className="overflow-x-auto shadow-lg rounded-2xl">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Referrer</th>
                <th className="px-4 py-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {stats.clickDetails.map((click, i) => (
                <motion.tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <td className="px-4 py-2 font-medium text-gray-700">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(click.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-red-600">{click.referrer}</td>
                  <td className="px-4 py-2 text-red-600">{click.location}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

