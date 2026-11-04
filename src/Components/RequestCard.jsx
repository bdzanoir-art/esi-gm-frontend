// src/Components/RequestCard.jsx
import { useNavigate } from 'react-router-dom';

export default function RequestCard({ request }) {
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded relative bg-white shadow">
      <div className="flex justify-between">
        <h2 className="font-bold">{request.project}</h2>
        <span
          className={`px-2 py-1 rounded text-white ${
            request.status === 'Pending'
              ? 'bg-yellow-500'
              : request.status === 'Approved'
                ? 'bg-green-500'
                : 'bg-blue-500'
          }`}
        >
          {request.status}
        </span>
      </div>
      <p>Requested by: {request.requestedBy}</p>
      <p>Purpose: {request.purpose}</p>
      <p>
        Dates: {request.startDate || '-'} → {request.endDate || '-'}
      </p>

      {request.status !== 'Pending' && (
        <button
          className="absolute right-4 bottom-4 px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => navigate(`/v/${request.id}`)}
        >
          View Validation Slip
        </button>
      )}
    </div>
  );
}
