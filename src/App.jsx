import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [successmsg, setSuccessmsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    const S3_BUCKET = "news-analyser-833387962189";
    const REGION = "ap-southeast-1";


    const formData = new FormData();

    // if (file) {
    // const s3client = new S3Client({
    //   region: "ap-southeast-1",
    //   credentials: {
    //     accessKeyId: process.env.ACCESSKEYID,
    //     secretAccessKey: process.env.SECRETACCESSKEY,
    //   },
    // });
    // console.log(file)
    // const params = {
    //   Bucket: "news-analyser-833387962189",
    //   Key: "news.txt",
    //   Body: file,
    // };
    // console.log(params);

    // try {
    //   const data = await s3client.send(new PutObjectCommand(params));
    //   // setMessage("Upload successful!");
    //   setSuccessmsg("File Uploaded!");
    //   console.log(data);
    //   console.log("file uploaded")
    // } catch (err) {
    //   console.error("Upload error:", err);
    //   setError("Upload failed.");
    // } finally {
    //   setLoading(false);
    // }

    // };

    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text);
    console.log(formData)

    try {
      const response = await axios.post(
        'https://g33lna9d47.execute-api.ap-southeast-1.amazonaws.com/v1/analyze',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze article.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">News Analyzer</h1>

      <textarea
        className="w-full max-w-2xl h-40 p-4 border border-gray-300 rounded mb-4"
        placeholder="Paste article text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* <input
        type="file"
        accept=".txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      /> */}
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
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16v-4a4 4 0 018 0v4m-6 4h4m-6-4h8m2 4a2 2 0 002-2v-6a2 2 0 
                00-2-2h-2l-2-2H9l-2 2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" />
          </svg>
          <p className="mb-1 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">.txt or .docx only</p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.docx"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Selected File: <span className="font-medium">{file.name}</span>
        </p>
      )}
      </div>

        
    {/* File DropOff */}
    {/* <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" />
        </label>
    </div>  */}

    {/* submit */}
    {/* <button onClick={handleSubmit} disabled={loading} type="button" className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
    {loading ? 
    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
    </svg>
    : 'Submit'}
    
    
    </button> */}

    <button
      onClick={handleSubmit}
      disabled={loading}
      type="button"
      className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center justify-center min-w-[100px]"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            aria-hidden="true"
            role="status"
            className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 
              100.591C22.3858 100.591 0 78.2051 0 
              50.5908C0 22.9766 22.3858 0.59082 50 
              0.59082C77.6142 0.59082 100 22.9766 100 
              50.5908ZM9.08144 50.5908C9.08144 73.1895 
              27.4013 91.5094 50 91.5094C72.5987 91.5094 
              90.9186 73.1895 90.9186 50.5908C90.9186 
              27.9921 72.5987 9.67226 50 9.67226C27.4013 
              9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 
              35.9116 97.0079 33.5539C95.2932 28.8227 
              92.871 24.3692 89.8167 20.348C85.8452 
              15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
              4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
              0.367541 46.6976 0.446843 41.7345 
              1.27873C39.2613 1.69328 37.813 4.19778 38.4501 
              6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 
              10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 
              10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 
              15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 
              25.841C84.9175 28.9121 86.7997 32.2913 88.1811 
              35.8758C89.083 38.2158 91.5421 39.6781 93.9676 
              39.0409Z"
              fill="#1C64F2"
            />
          </svg>
        </div>
      ) : (
        'Submit'
      )}
    </button>

       {/* <button
        onClick={handleSubmit}
        class="inline w-4 h-4 me-3 text-gray-200 dark:text-gray-600"
        disabled={loading}
      >
        
        {loading ? loading : 'Submit'}
      </button> */}


      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* {successmsg && <p className="mt-4 text-green-500">{successmsg}</p>} */}

      {result && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="mb-4">{result.summary}</p>

          <h2 className="text-xl font-semibold mb-2">Nationalities / Countries</h2>
          <ul className="list-disc pl-6">
            {result.nationalities.map((nation, index) => (
              <li key={index}>{nation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
