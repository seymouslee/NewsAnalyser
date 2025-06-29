import React from 'react';
import useNewsAnalyzer from './hooks/useNewsAnalyzer';
import SiteHeaders from './components/SiteHeaders';
import TextAreaInput from './components/TextAreaInput';
import FileUploader from './components/FileUploader';
import SubmitButton from './components/SubmitButton';
import ResultDisplay from './components/ResultDisplay';

function MainApp({ user, signOut }) {
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
        <SiteHeaders username={user.username} signOut={signOut}/>
        <TextAreaInput text={text} setText={setText} />
        <FileUploader file={file} setFile={setFile} />
        <SubmitButton loading={loading} onClick={() => handleSubmit(user.username)} />
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <ResultDisplay result={result} />
      </div>
  );
}

export default MainApp;
