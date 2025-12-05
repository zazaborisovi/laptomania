import { Link } from 'react-router';
import { useAuth } from '../../context/auth.context';
import { useState } from 'react';
import { useLaptop } from '../../context/laptops.context';
import { useMemo } from 'react';

const Nav = () => {
  const { user, logout } = useAuth();
  const { cart, addToCart, reduceOne, removeProduct, clearCart } = useLaptop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const totalItems = useMemo(() => 
    cart.reduce((prev, cur) => prev + cur.quantity, 0), 
    [cart]
  )
  const totalPrice = useMemo(() => 
    cart.reduce((prev, cur) => prev + cur.price * cur.quantity, 0), 
    [cart]
  )

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
            >
              Laptomania
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/laptops"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Laptops
              </Link>

              {user ? (
                <>
                  {/* Cart Button */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>

                  {user.role === 'admin' && (
                    <Link
                      to="/panel"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                    >
                      Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/laptops"
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  Laptops
                </Link>

                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsCartOpen(true);
                        setMobileMenu(false);
                      }}
                      className="text-left text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </button>
                    {user.role === 'admin' && (
                      <Link
                        to="/panel"
                        className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        onClick={() => setMobileMenu(false)}
                      >
                        Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenu(false);
                      }}
                      className="text-left text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setMobileMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setMobileMenu(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg overflow-hidden flex-shrink-0">
                          {item.images?.[0]?.url && (
                            <img
                              src={item.images[0].url}
                              alt={item.model}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {item.brand} {item.model}
                          </h3>
                          <p className="text-blue-600 font-bold">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => reduceOne(item)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeProduct(item)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <p className="text-sm font-semibold text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-lg">
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Nav;
