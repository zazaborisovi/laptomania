import { useParams, useNavigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useLaptop } from '../context/laptops.context';
import { useAuth } from '../context/auth.context';

const LaptopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { laptops, addToCart } = useLaptop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const laptop = laptops?.find((laptop) => laptop._id === id);

  useEffect(() => {
    if (!laptop && laptops?.length > 0) {
      navigate('/laptops');
    }
  }, [laptop, laptops, navigate]);

  if (!laptop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading laptop details...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(laptop);
    }
  };

  const specifications = [
    { label: 'Brand', value: laptop.brand },
    { label: 'Model', value: laptop.model },
    { label: 'Processor', value: laptop.processor },
    { label: 'RAM', value: laptop.ram },
    { label: 'Storage', value: laptop.storage },
    { label: 'Graphics', value: laptop.graphics },
    { label: 'Display', value: laptop.display },
    { label: 'Operating System', value: laptop.os },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/laptops"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalog
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 aspect-video">
              {laptop.images?.[selectedImage]?.url ? (
                <img
                  src={laptop.images[selectedImage].url}
                  alt={`${laptop.brand} ${laptop.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No image available</span>
                </div>
              )}
              {laptop.stock < 5 && laptop.stock > 0 && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Only {laptop.stock} left in stock!
                </div>
              )}
              {laptop.stock === 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Sold Out
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {laptop.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {laptop.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-blue-600 shadow-lg'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${laptop.brand} ${laptop.model} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {laptop.brand} {laptop.model}
              </h1>
              <p className="text-xl text-gray-600">{laptop.processor}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-blue-600">${laptop.price}</span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  laptop.stock > 5
                    ? 'bg-green-100 text-green-700'
                    : laptop.stock > 0
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {laptop.stock > 5 ? 'In Stock' : laptop.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{laptop.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-semibold text-gray-700">{spec.label}:</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {user && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={laptop.stock === 0}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={laptop.stock}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, Math.min(laptop.stock, parseInt(e.target.value) || 1))
                          )
                        }
                        disabled={laptop.stock === 0}
                        className="w-20 px-4 py-3 text-center border-x border-gray-300 focus:outline-none disabled:bg-gray-50"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(laptop.stock, quantity + 1))}
                        disabled={laptop.stock === 0}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-600">{laptop.stock} available</span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={laptop.stock === 0}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {laptop.stock === 0
                    ? 'Out of Stock'
                    : `Add ${quantity} to Cart - $${(laptop.price * quantity).toFixed(2)}`}
                </button>
              </div>
            )}

            {/* Sign in prompt for non-logged users */}
            {!user && (
              <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-200">
                <p className="text-center text-gray-700 mb-4 text-lg">
                  Please sign in to purchase this laptop
                </p>
                <div className="flex gap-3">
                  <Link to="/login" className="flex-1">
                    <button className="w-full px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">High Performance</h3>
                    <p className="text-gray-600">{laptop.processor} for seamless multitasking</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Ample Memory</h3>
                    <p className="text-gray-600">{laptop.ram} RAM for smooth operation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Storage Capacity</h3>
                    <p className="text-gray-600">{laptop.storage} storage for all your files</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Warranty Included</h3>
                    <p className="text-gray-600">{laptop.warranty || '1 year'} manufacturer warranty</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopDetail;
