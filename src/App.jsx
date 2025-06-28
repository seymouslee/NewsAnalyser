import React from 'react';
import useNewsAnalyzer from './hooks/useNewsAnalyzer';
import TextAreaInput from './components/TextAreaInput';
import FileUploader from './components/FileUploader';
import SubmitButton from './components/SubmitButton';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const {
    text, setText,
    file, setFile,
    result,
    loading,
    error,
    handleSubmit
  } = useNewsAnalyzer();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">News Analyzer</h1>
      <TextAreaInput text={text} setText={setText} />
      <FileUploader file={file} setFile={setFile} />
      <SubmitButton loading={loading} onClick={handleSubmit} />
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <ResultDisplay result={result} />
    </div>
  );
}

export default App;
