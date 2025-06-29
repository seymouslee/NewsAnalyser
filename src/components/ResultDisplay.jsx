export default function ResultDisplay({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6 w-full max-w-2xl bg-white p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <p className="mb-4">{result.summary}</p>
      <h2 className="text-xl font-semibold mb-2">Nationalities / Countries</h2>
      <ul className="list-disc pl-6 mb-4">
        {result.nationalities.map((nation, index) => (
          <li key={index}>{nation}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">People / Organisations Mentioned</h2>
      <ul className="list-disc pl-6 mb-4">
        {result.entities.map((nation, index) => (
          <li key={index}>{nation}</li>
        ))}
      </ul>
    </div>
  );
}
