import { useContext } from 'react';
import { RequestContext } from '../context/RequestContext';

export default function useRequests() {
  return useContext(RequestContext);
}
