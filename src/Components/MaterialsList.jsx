export default function MaterialsList({ materials, setMaterials }) {
  const addMaterial = () => setMaterials([...materials, { materialId: '', quantity: 1 }]);

  const removeMaterial = (index) => setMaterials(materials.filter((_, i) => i !== index));

  const updateMaterial = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  return (
    <div className="space-y-2">
      {materials.map((m, i) => (
        <div key={i} className="flex space-x-2 items-center">
          <input
            className="border p-1 flex-1"
            placeholder="Material ID"
            value={m.materialId}
            onChange={(e) => updateMaterial(i, 'materialId', e.target.value)}
          />
          <input
            className="border p-1 w-20"
            type="number"
            value={m.quantity}
            onChange={(e) => updateMaterial(i, 'quantity', e.target.value)}
          />
          <button className="bg-red-500 text-white px-2" onClick={() => removeMaterial(i)}>
            Delete
          </button>
        </div>
      ))}
      <button className="bg-blue-500 text-white px-4 py-1" onClick={addMaterial}>
        Add Material
      </button>
    </div>
  );
}
