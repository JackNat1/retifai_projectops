import React, { useEffect, useState } from 'react';
import { getProjects, getProjectAreas, createArea } from '../services/api';
import { Plus, MapPin } from 'lucide-react';

interface Project {
  id: number;
  project_name: string;
}

interface Area {
  id: number;
  area_name: string;
  area_type: string;
  notes: string;
}

const AreasPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newArea, setNewArea] = useState({
    area_name: '',
    area_type: 'interior_room',
    notes: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchAreas(selectedProjectId);
    } else {
      setAreas([]);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchAreas = async (projectId: number) => {
    try {
      const response = await getProjectAreas(projectId);
      setAreas(response.data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const handleCreateArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createArea(selectedProjectId, newArea);
      setShowModal(false);
      setNewArea({ area_name: '', area_type: 'interior_room', notes: '' });
      fetchAreas(selectedProjectId);
    } catch (error) {
      console.error('Error creating area:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedProjectId}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <Plus size={20} className="mr-2" />
          Add Area
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{area.area_name}</h3>
                <p className="text-sm text-gray-500 capitalize">{area.area_type.replace('_', ' ')}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{area.notes || 'No notes provided.'}</p>
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Manage Devices</button>
            </div>
          </div>
        ))}
        {selectedProjectId && areas.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
            No areas defined for this project.
          </div>
        )}
        {!selectedProjectId && (
          <div className="col-span-full py-12 text-center text-gray-500">
            Please select a project to view its areas.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Area</h3>
            <form onSubmit={handleCreateArea}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Area Name</label>
                <input
                  type="text"
                  required
                  value={newArea.area_name}
                  onChange={(e) => setNewArea({ ...newArea, area_name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. Living Room, Rack 1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Area Type</label>
                <select
                  value={newArea.area_type}
                  onChange={(e) => setNewArea({ ...newArea, area_type: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="interior_room">Interior Room</option>
                  <option value="exterior_zone">Exterior Zone</option>
                  <option value="rack">Rack</option>
                  <option value="closet">Closet</option>
                  <option value="patio">Patio</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newArea.notes}
                  onChange={(e) => setNewArea({ ...newArea, notes: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasPage;
