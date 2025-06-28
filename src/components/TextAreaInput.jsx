export default function TextAreaInput({ text, setText }) {
  return (
    <textarea
      className="w-full max-w-2xl h-40 p-4 border-2 border-gray-300 rounded-lg mb-4"
      placeholder="Paste article text here..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}