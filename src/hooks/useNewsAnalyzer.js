import { useState } from 'react';
import axios from 'axios';
import { uploadData } from 'aws-amplify/storage';

export default function useNewsAnalyzer() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ username }) => {
    setLoading(true);
    setResult(null);
    setError(null);

    

    const formData = new FormData();
    // if (file) formData.append('file', file);

    if (!file && !text) {
      setError('Please submit something to proceed.');
      setLoading(false);
      return;
    }
    
    if (file){
      console.log(file)

      // check file extension
      const fileName = file.name;
      if (!fileName.endsWith('.txt') && !fileName.endsWith('.docx')) {
        console.error('Invalid file type: ', fileName);
        setError('Invalid file type. Please upload a .txt or .docx file.');
        setLoading(false);
      }

      // upload file to s3
      try {
        const key = `${username}/${fileName}`;
        const result = await uploadData({
          key: key,
          data: file,
          options: {
            accessLevel: 'private', // default is 'guest'
            contentType: file.type,
          },
        }).result;
        console.log(result.key)
        formData.append('filedir', result.key);
      } catch (err) {
        console.log("Error uploading file:", err)
        setError('Failed to upload file.');
      } finally {
        setLoading(false);
        return;
      }
      
    }
    
    if (text.trim()) formData.append('text', text);

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
