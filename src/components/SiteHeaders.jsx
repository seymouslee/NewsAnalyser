export default function SiteHeaders({ username, signOut }) {
  return (
    <div className="w-full max-w-2xl mb-4">
      <div>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome, <span className="text-blue-800">{username}</span>
          </h2>
          <button
            onClick={signOut}
            className="ml-4 bg-gray-800 hover:bg-gray-700 text-white font-small px-4 py-2 rounded-lg transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center p-8">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text mb-3">
          TL;DR Times
          </h1>
          <p className="text-lg text-gray-600 w-full text-lg">
              Too long, didn’t read? Paste or upload your news articles and get a quick summary.
          </p>
      </div>
    </div>
  );
}