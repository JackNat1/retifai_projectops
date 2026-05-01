import React, { useEffect, useState } from 'react';
import { getItems, createItem } from '../services/api';
import { Plus, Search, Box } from 'lucide-react';

interface Item {
  id: number;
  item_name: string;
  manufacturer: string;
  model_number: string;
  category: string;
  msrp: number;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: '',
    manufacturer: '',
    model_number: '',
    category: '',
    msrp: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem(newItem);
      setShowModal(false);
      setNewItem({
        item_name: '',
        manufacturer: '',
        model_number: '',
        category: '',
        msrp: 0,
      });
      fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Item
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MSRP</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Box size={20} className="text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.model_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.msrp?.toLocaleString()}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No items found in master list.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Item Master</h3>
            <form onSubmit={handleCreateItem}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                <input
                  type="text"
                  value={newItem.manufacturer}
                  onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Model Number</label>
                <input
                  type="text"
                  value={newItem.model_number}
                  onChange={(e) => setNewItem({ ...newItem, model_number: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. Speakers, Amplifiers"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">MSRP ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.msrp}
                  onChange={(e) => setNewItem({ ...newItem, msrp: parseFloat(e.target.value) })}
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
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
