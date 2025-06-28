import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text);

    try {
      const response = await axios.post(
        'https://g33lna9d47.execute-api.ap-southeast-1.amazonaws.com/v1/analyser',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      // setResult(response.data);
      console.log(response);
      console.log(response.data);
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze article.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8" >
      <h1 className="text-3xl font-bold mb-6">News Analyzer</h1>

      <textarea
        className="w-full max-w-2xl h-40 p-4 border border-gray-300 rounded mb-4"
        placeholder="Paste article text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="file"
        accept=".txt,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
            <input id="dropzone-file" type="file" class="hidden" />
          </label>
        </div> 

        <div
          class="bg-gray-50 text-center px-4 rounded max-w-md flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto">
          <div class="py-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 mb-4 fill-slate-600 inline-block" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
            <h4 class="text-base font-semibold text-slate-600">Drag and drop files here</h4>
          </div>

          <hr class="w-full border-gray-300 my-2" />

          <div class="py-6">
            <input type="file" id='uploadFile1' class="hidden" />
            <label for="uploadFile1"
              class="block px-6 py-2.5 rounded text-slate-600 text-sm tracking-wider font-semibold border-none outline-none cursor-pointer bg-gray-200 hover:bg-gray-100">Browse
              Files</label>
            <p class="text-xs text-slate-500 mt-4">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
          </div>
        </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Submit'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

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
