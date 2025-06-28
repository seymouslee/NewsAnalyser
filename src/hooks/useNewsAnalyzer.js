import { useState } from 'react';
import axios from 'axios';

export default function useNewsAnalyzer() {
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
