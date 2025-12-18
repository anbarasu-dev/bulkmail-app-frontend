import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emaillist, setemaillist] = useState([]);

  const handlechange = (e) => {
    setmsg(e.target.value);
  };

  const handlesend = () => {
    setstatus(true);
    axios
      .post("https://bulkmail-app-backend-6.onrender.com/sendmail", {
        msg: msg,
        emaillist: emaillist,
      })
      .then(function (data) {
        setstatus(false);
        if (data.data === true) {
          alert("Email sent successfully");
        } else {
          alert("Failed");
        }
      })
      .catch(() => {
        setstatus(false);
        alert("Server Error");
      });
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

      const totalemail = emailList.map((item) => item.A);
      setemaillist(totalemail);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white text-center py-4">
        <h1 className="text-3xl font-semibold">📧 Bulk Mail App</h1>
        <p className="text-sm mt-1">
          Send multiple emails easily with Excel upload
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-blue-100 min-h-screen flex justify-center items-start py-10">
        <div className="bg-white w-[85%] md:w-[60%] rounded-xl shadow-lg p-6">
          
          {/* Text Area */}
          <label className="font-medium">Email Message</label>
          <textarea
            className="w-full h-32 mt-2 p-2 border border-gray-400 rounded-md outline-none"
            placeholder="Enter your email content..."
            value={msg}
            onChange={handlechange}
          ></textarea>

          {/* Character Counter */}
          <p className="text-sm text-gray-600 text-right">
            Characters: {msg.length}
          </p>

          {/* File Upload */}
          <div className="mt-4">
            <label className="font-medium">Upload Excel File</label>
            <input
              type="file"
              onChange={handleFile}
              className="w-full mt-2 border-2 border-dashed p-4 rounded-md"
            />
          </div>

          {/* Email Count */}
          <div className="mt-4 flex justify-between items-center">
            <span className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
              📧 Total Emails: {emaillist.length}
            </span>
          </div>

          {/* Email Preview */}
          <div className="mt-5">
            <h3 className="font-medium mb-2">👀 Email Preview</h3>
            <div className="border rounded-md p-3 bg-gray-50 text-sm">
              {msg ? msg : "Your email content will appear here..."}
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handlesend}
              disabled={status}
              className={`px-6 py-2 rounded-md text-white font-medium transition 
              ${
                status
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              }`}
            >
              {status ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-900 text-white text-center py-3 text-sm">
        Built with ❤️ using React, Node & Nodemailer
      </div>
    </>
  );
}

export default App;
