import { useEffect, useState } from 'react';
import { adminAPI } from '../Api/api.service';

export default function Reports() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    adminAPI.getMaterials().then((res) => {
      const data = res.data;
      setItems(Array.isArray(data) ? data : data.results ?? []);
    });
  }, []);

  const byStatus = items.reduce((acc, m) => {
    const key = m.status || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: 24 }}>
      <h1>Reports</h1>
      <p>Total materials: {items.length}</p>
      <ul>
        {Object.entries(byStatus).map(([status, n]) => (
          <li key={status}>{status}: {n}</li>
        ))}
      </ul>
    </div>
  );
}
