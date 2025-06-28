export default function SiteHeaders() {
  return (
    <div className="flex flex-col items-center p-8">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text mb-3">
        TL;DR Times
        </h1>
        <p className="text-lg text-gray-600 w-full max-w-2xl mb-4">
            Too long, didn’t read? Paste or upload your news articles and get a quick summary.
        </p>
    </div>
  );
}