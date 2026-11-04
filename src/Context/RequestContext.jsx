import { createContext, useState, useEffect } from 'react';
import { getRequests } from '../Api/RequestApi';

export const RequestContext = createContext();

export function RequestProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <RequestContext.Provider value={{ requests, loading, fetchRequests, setRequests }}>
      {children}
    </RequestContext.Provider>
  );
}
