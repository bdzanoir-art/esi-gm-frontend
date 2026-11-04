// src/Api/fakeApi.js

let requests = [
  {
    id: 1,
    project: 'IoT Weather Station',
    requestedBy: 'Sarah Student',
    created: '2/15/2026',
    updated: '2/16/2026',
    status: 'Approved',
    purpose: 'Project work',
    startDate: '2/15/2026',
    endDate: '2/16/2026',
    materials: [
      { name: 'Arduino Uno R3', category: 'Electronics', quantity: 1 },
      { name: 'Multimeter Fluke 87V', category: 'Electronics', quantity: 1 },
    ],
  },
];

export const fetchRequestsFake = () => requests;

export const createRequestFake = (newRequest) => {
  const id = requests.length + 1;
  const requestWithId = {
    ...newRequest,
    id,
    status: 'Pending',
    created: new Date().toLocaleDateString(),
    updated: new Date().toLocaleDateString(),
  };
  requests.push(requestWithId);
  return requestWithId;
};

// Fetch validation info (simulates API)
export const fetchValidationFake = (id) => {
  const req = requests.find((r) => r.id === parseInt(id));
  if (!req || req.status === 'Pending') return null;
  return {
    student: req.requestedBy,
    project: req.project,
    created: req.created,
    validated: req.updated,
    items: req.materials,
    qrCode: `ESI-${id}-FAKEQR`,
  };
};
