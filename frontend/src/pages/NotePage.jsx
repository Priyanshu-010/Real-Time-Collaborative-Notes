import { useParams } from "react-router-dom";

function NotePage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold">View Note</h1>
      <p>Note ID: {id}</p>
    </div>
  );
}

export default NotePage;
