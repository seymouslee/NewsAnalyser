import { useState } from 'react';
import axios from 'axios';
import { uploadData } from 'aws-amplify/storage';
// import { getCurrentIdentityId } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';


export default function useNewsAnalyzer() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (username) => {
    setLoading(true);
    setResult(null);
    setError(null);

    const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
    const session = await fetchAuthSession();
    const identityId = session.identityId;

    const formData = new FormData();

    if (file && text.trim()){
      setError('Please either send a text or upload your file.');
      setLoading(false);
      return;
    }
    
    if (file){

      // check file extension
      const fileName = file.name;
      if (!fileName.endsWith('.txt') && !fileName.endsWith('.docx')) {
        console.error('Invalid file type: ', fileName);
        setError('Invalid file type. Please upload a .txt or .docx file.');
        setLoading(false);
        return;
      }

      // upload file to s3
      try {
        const key = `${username}/${fileName}`;
        const result = await uploadData({
          key: key,
          data: file,
          options: {
            accessLevel: 'private',
            contentType: file.type,
          },
        }).result;
        const fullS3Path = `private/${identityId}/${key}`;
        formData.append('filedir', fullS3Path);
      } catch (err) {
        console.log("Error uploading file:", err)
        setError('Failed to upload file.');
        setLoading(false);
        return;
      }
    } else if (text.trim()){
      formData.append('text', text);
    } else {
      setError('Please submit something to proceed.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        backendEndpoint,
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

  return {
    text,
    setText,
    file,
    setFile,
    result,
    loading,
    error,
    handleSubmit
  };
}
