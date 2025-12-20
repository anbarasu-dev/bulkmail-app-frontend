import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emaillist, setEmailList] = useState([]);


  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


  const handleChange = (e) => setMsg(e.target.value);

  
    if (!msg || emaillist.length === 0) {
      alert("Please enter a message and upload emails.");
      return;
    }

    setStatus(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/sendmail`,
        { msg, emaillist },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        alert("✅ Emails sent successfully");
        setMsg("");
        setEmailList([]);
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (error) {
      alert(
        "❌ Server Error: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setStatus(false);
    }
  };

  /* ================= HANDLE EXCEL FILE ================= */
  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

      const emails = rows
        .map((row) => row.A)
        .filter(
          (email) =>
            typeof email === "string" && email.includes("@")
        );

      setEmailList(emails);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
     
      <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white text-center py-4">
        <h1 className="text-3xl font-semibold">📧 Bulk Mail App</h1>
        <p className="text-sm mt-1">
          Send multiple emails easily with Excel upload
        </p>
      </div>

 
      <div className="bg-blue-100 min-h-screen flex justify-center items-start py-10">
        <div className="bg-white w-[85%] md:w-[60%] rounded-xl shadow-lg p-6">

        
          <label className="font-medium">Email Message</label>
          <textarea
            className="w-full h-32 mt-2 p-2 border border-gray-400 rounded-md outline-none"
            placeholder="Enter your email content..."
            value={msg}
            onChange={handleChange}
          />

          <p className="text-sm text-gray-600 text-right">
            Characters: {msg.length}
          </p>

         
          <div className="mt-4">
            <label className="font-medium">Upload Excel File</label>
            <input
              type="file"
              onChange={handleFile}
              className="w-full mt-2 border-2 border-dashed p-4 rounded-md"
              accept=".xlsx,.xls"
            />
          </div>

      
          <div className="mt-4">
            <span className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
              📧 Total Emails: {emaillist.length}
            </span>
          </div>

       
          <div className="mt-5">
            <h3 className="font-medium mb-2">👀 Email Preview</h3>
            <div className="border rounded-md p-3 bg-gray-50 text-sm">
              {msg || "Your email content will appear here..."}
            </div>
          </div>

         
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSend}
              disabled={status}
              className={`px-6 py-2 rounded-md text-white font-medium ${
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

     
      <div className="bg-blue-900 text-white text-center py-3 text-sm">
        Built with ❤️ using React, Node & SendGrid
      </div>
    </>
  );
}

export default App;
