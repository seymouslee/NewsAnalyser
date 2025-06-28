// src/components/UploadFile.jsx
import React from 'react';
import { uploadData } from 'aws-amplify/storage';

export default function UploadFile({ username }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const key = `${username}/${file.name}`;

    try {
      const result = await uploadData({
        key: key,
        data: file,
        options: {
          accessLevel: 'private', // default is 'guest'
          contentType: file.type,
        },
      }).result;

      alert("Upload successful!");
      console.log("Upload result:", result);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed. See console for details.");
    }
  };

  return (
    <div className="my-4">
      <label className="block mb-2 font-medium text-gray-700">Upload a file:</label>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}
