// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/auth.context';
import { useLaptop } from '../context/laptops.context';

const Laptop = ({ laptop }) => {
  const { deleteLaptop, updateLaptop, addToCart } = useLaptop();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const editableFields = Object.keys(laptop).filter(
    (key) => !['_id', '__v', 'createdAt', 'updatedAt', 'isAvailable', 'images'].includes(key)
  );
// useCallback hook will memorize the function so it doesnt rerender everytime something changes
  const handleUpdate = useCallback(async (e) => { 
    e.preventDefault();
    const formData = new FormData(e.target);
    await updateLaptop(laptop._id, formData);
    setEditing(false);
  }, [laptop._id, updateLaptop])

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 group">
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-cyan-50 overflow-hidden">
        {laptop.images?.[0]?.url && (
          <img
            src={laptop.images[0].url}
            alt={`${laptop.brand} ${laptop.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        {laptop.stock < 5 && laptop.stock > 0 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Only {laptop.stock} left!
          </div>
        )}
        {laptop.stock === 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Out of Stock
          </div>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          {editableFields.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              {key === 'description' ? (
                <textarea
                  name={key}
                  defaultValue={laptop[key]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              ) : (
                <input
                  type={key === 'price' || key === 'stock' ? 'number' : 'text'}
                  name={key}
                  defaultValue={laptop[key]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {laptop.brand} {laptop.model}
            </h3>
            <p className="text-gray-600">{laptop.processor}</p>
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold w-20">RAM:</span>
              <span>{laptop.ram}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold w-20">Storage:</span>
              <span>{laptop.storage}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold w-20">GPU:</span>
              <span>{laptop.graphics}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold w-20">Display:</span>
              <span>{laptop.display}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">{laptop.description}</p>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <span className="text-3xl font-bold text-blue-600">${laptop.price}</span>
            <span className="text-sm text-gray-500">Stock: {laptop.stock} units</span>
          </div>

          <div className="space-y-2">
            <Link
              to={`/laptops/${laptop._id}`}
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
            >
              View Details
            </Link>
            {user?.role === 'admin' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => deleteLaptop(laptop._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
                >
                  Update
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(laptop)}
                disabled={laptop.stock === 0}
                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {laptop.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Catalog = () => {
  const { laptops } = useLaptop();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

// useMemo hook will memoize the expensive calculation and it will calculate again when laptop changes 
  const filteredLaptops = useMemo(() => { 
    return laptops
      ?.filter((laptop) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          laptop.brand?.toLowerCase().includes(searchLower) ||
          laptop.model?.toLowerCase().includes(searchLower) ||
          laptop.processor?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name':
            return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
          default:
            return 0;
        }
      });
  }, [laptops, searchTerm, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-blue-600">Laptop Collection</span>
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect laptop that matches your needs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Laptops
              </label>
              <input
                type="text"
                placeholder="Search by brand, model, or processor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Laptops Grid */}
        {!laptops ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading laptops...</p>
          </div>
        ) : filteredLaptops?.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No laptops found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              Showing {filteredLaptops.length} laptop{filteredLaptops.length !== 1 ? 's' : ''}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLaptops.map((laptop) => (
                <Laptop key={laptop._id} laptop={laptop} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;
