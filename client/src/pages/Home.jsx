import { Link } from 'react-router';
import { useLaptop } from '../context/laptops.context';
import { useAuth } from '../context/auth.context';

const Home = () => {
  const { laptops } = useLaptop();
  const { user } = useAuth();
  const featuredLaptops = laptops?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-cyan-200">Laptomania</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover the perfect laptop for your needs. Premium quality, unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/laptops"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Browse Laptops
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(239 246 255)"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Why Choose <span className="text-blue-600">Laptomania?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Premium Quality</h3>
            <p className="text-gray-600 leading-relaxed">
              Only the best laptops from trusted brands. Every product is carefully selected and verified.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Best Prices</h3>
            <p className="text-gray-600 leading-relaxed">
              Competitive pricing with regular deals and discounts. Get the best value for your money.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Fast Delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Quick and secure shipping. Get your new laptop delivered right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Laptops */}
      {featuredLaptops.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Featured <span className="text-blue-600">Laptops</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredLaptops.map((laptop) => (
              <Link
                key={laptop._id}
                to={`/laptops/${laptop._id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-50 overflow-hidden">
                  {laptop.images?.[0]?.url && (
                    <img
                      src={laptop.images[0].url}
                      alt={`${laptop.brand} ${laptop.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {laptop.brand} {laptop.model}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{laptop.processor}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">${laptop.price}</span>
                    <span className="text-sm text-gray-500">{laptop.stock} in stock</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/laptops"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              View All Laptops
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Laptop?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who found their ideal device with us.
          </p>
          <Link
            to="/laptops"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
