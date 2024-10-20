'use client';
import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFetchSubtitles = async () => {
    try {
      const response = await fetch(`/api/subtitles?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (response.ok) {
        setSubtitles(data.text);
        setError('');
      } else {
        setError(data.error || 'An error occurred');
        setSubtitles(null);
      }
    } catch (err) {
      setError('Failed to fetch subtitles');
      setSubtitles(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">YouTube Subtitle Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 mb-4 w-full text-black"
      />
      <button onClick={handleFetchSubtitles} className="bg-blue-500 text-white px-4 py-2">
        Fetch Subtitles
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {subtitles && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Extracted Subtitles:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-black">{subtitles}</pre>
        </div>
      )}
    </div>
  );
}
