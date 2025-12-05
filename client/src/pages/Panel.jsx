import { useAuth } from '../context/auth.context';
import { useLaptop } from '../context/laptops.context';
import { useState } from 'react';

const Panel = () => {
  const { user } = useAuth();
  const { addLaptop } = useLaptop();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    await addLaptop(formData);

    setIsSubmitting(false);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Admin <span className="text-blue-600">Panel</span>
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, <span className="font-semibold">{user?.name || 'Admin'}</span>
          </p>
        </div>

        {/* Add Laptop Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Laptop</h2>
            <p className="text-gray-600">Fill in the details to add a new laptop to the catalog</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    placeholder="e.g., Dell, HP, Lenovo"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-semibold text-gray-700 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    placeholder="e.g., XPS 15, Spectre x360"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Technical Specifications
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="processor" className="block text-sm font-semibold text-gray-700 mb-2">
                    Processor <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="processor"
                    name="processor"
                    type="text"
                    placeholder="e.g., Intel Core i7 11th Gen"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="ram" className="block text-sm font-semibold text-gray-700 mb-2">
                    RAM <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ram"
                    name="ram"
                    type="text"
                    placeholder="e.g., 16GB DDR4"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="storage" className="block text-sm font-semibold text-gray-700 mb-2">
                    Storage <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="storage"
                    name="storage"
                    type="text"
                    placeholder="e.g., 512GB SSD"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="graphics" className="block text-sm font-semibold text-gray-700 mb-2">
                    Graphics <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="graphics"
                    name="graphics"
                    type="text"
                    placeholder="e.g., NVIDIA GeForce RTX 3060"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="display" className="block text-sm font-semibold text-gray-700 mb-2">
                    Display <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="display"
                    name="display"
                    type="text"
                    placeholder="e.g., 15.6 inches FHD"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="os" className="block text-sm font-semibold text-gray-700 mb-2">
                    Operating System <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="os"
                    name="os"
                    type="text"
                    placeholder="e.g., Windows 11, macOS"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Pricing & Inventory
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="999.99"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="e.g., 10"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Description and Images */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Description & Images
              </h3>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Describe the laptop's features, benefits, and ideal use cases..."
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          required
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Laptop...
                  </span>
                ) : (
                  'Add Laptop to Catalog'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Panel;
