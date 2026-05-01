import React, { useEffect, useState } from 'react';
import { getVendors, createVendor } from '../services/api';
import { Plus, Users, Globe } from 'lucide-react';

interface Vendor {
  id: number;
  vendor_name: string;
  vendor_type: string;
  website: string;
  contact_name: string;
}

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    vendor_name: '',
    vendor_type: '',
    website: '',
    contact_name: '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await getVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVendor(newVendor);
      setShowModal(false);
      setNewVendor({
        vendor_name: '',
        vendor_type: '',
        website: '',
        contact_name: '',
      });
      fetchVendors();
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-700">Vendor Management</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full mr-4">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{vendor.vendor_name}</h3>
                <p className="text-sm text-gray-500">{vendor.vendor_type || 'General Vendor'}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {vendor.website && (
                <div className="flex items-center text-sm text-blue-600">
                  <Globe size={16} className="mr-2" />
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {vendor.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {vendor.contact_name && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Contact:</span> {vendor.contact_name}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">View Catalog</button>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
            No vendors registered.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Vendor</h3>
            <form onSubmit={handleCreateVendor}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input
                  type="text"
                  required
                  value={newVendor.vendor_name}
                  onChange={(e) => setNewVendor({ ...newVendor, vendor_name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vendor Type</label>
                <input
                  type="text"
                  value={newVendor.vendor_type}
                  onChange={(e) => setNewVendor({ ...newVendor, vendor_type: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. AV Distributor, Electrical"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="https://..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  value={newVendor.contact_name}
                  onChange={(e) => setNewVendor({ ...newVendor, contact_name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                  Create Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
