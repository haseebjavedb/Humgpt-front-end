import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Paperclip, Send } from "react-feather";
import Helpers from "../../../Config/Helpers";

const Reports = () => {
  const { chatid } = useParams();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("chatid", chatid);
      formData.append("userInput", userInput);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await axios.post(
        `${Helpers.apiUrl}user/uploadDoc2`,
        formData,
        Helpers.authHeaders
      );

      setUserInput(""); // Clear userInput after submission
      setSelectedFile(null); // Clear selectedFile after submission

      // Navigate to the next page with chatid as a parameter
      navigate(`/user/Reports/${response.data.chatid}`, {
        state: { prompt: userInput, selectedFile }, // Include prompt and selectedFile in the state
      });
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4 text-center">Report Analysis</h2>
              <span className="card-title mb-4 text-center p-2">
                Upload your Report for analysis
              </span>
              <textarea
                className="form-control mb-3"
                id="messageInput"
                rows="4"
                placeholder="Describe the report or add comments "
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              ></textarea>

              {/* Display the selected file */}
              {selectedFile && (
                <div className="selected-file mb-3">
                  Selected File: {selectedFile.name}
                </div>
              )}

              {/* File input */}
              <div className="file-input-wrapper">
                <label htmlFor="file-upload" className="upload-label">
                  <Paperclip size={20} />
                  Select Your Report
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {/* Submit button */}
              <button
                type="button"
                className="btn btn-primary w-100 mt-4"
                id="sendButton"
                onClick={handleSubmit}
                disabled={isLoading || (userInput.trim() === "" && !selectedFile)}
              >
                {isLoading ? "Analyzing..." : "Analyze Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
