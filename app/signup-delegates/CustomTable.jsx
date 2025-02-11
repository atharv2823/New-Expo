import React from "react";

const ScheduleTable = ({ ScheduleData }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm w-full h-[50vh]">
      <div className="container mx-auto p-4">
        {ScheduleData.map((schedule) => (
          <div key={schedule.id} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 pb-2 mb-4">
              {schedule.date}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Sector</th>
                    <th className="border border-gray-300 px-4 py-2">Title</th>
                    <th className="border border-gray-300 px-4 py-2">Hall</th>
                    <th className="border border-gray-300 px-4 py-2">Speaker</th>

                  </tr>
                </thead>
                <tbody>
                  {schedule.sessions.map((session, index) => (
                    <tr key={index} className="border border-gray-300">
                      <td className="border border-gray-300 px-4 py-2">
                        {session.time}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {session.sector}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {session.title || "TBA"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {session.hall || "TBA"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {session.spaeker || "TBA"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTable;
