export default function SiteHeaders({ username, signOut }) {
  return (
    <div className="flex flex-col items-center p-8">
      <h2>Welcome, {username}</h2>
      <button onClick={signOut} className="bg-gray-800 text-white px-4 py-2 rounded">
        Sign Out
      </button>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text mb-3">
        TL;DR Times
        </h1>
        <p className="text-lg text-gray-600 w-full max-w-2xl mb-4">
            Too long, didn’t read? Paste or upload your news articles and get a quick summary.
        </p>
    </div>
  );
}