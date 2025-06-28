import { useState } from 'react';

export default function FileUploader({ file, setFile }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full max-w-2xl mb-4">
      <div
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-100'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile && (droppedFile.type === "text/plain" || droppedFile.name.endsWith(".docx"))) {
            setFile(droppedFile);
          }
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 16v-4a4 4 0 018 0v4m-6 4h4m-6-4h8m2 4a2 2 0 002-2v-6a2 2 0 
              00-2-2h-2l-2-2H9l-2 2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" />
        </svg>
        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-400">.txt or .docx only</p>
        <input id="file-upload" type="file" accept=".txt,.docx" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Selected File: <span className="font-medium">{file.name}</span>
        </p>
      )}
    </div>
  );
}
