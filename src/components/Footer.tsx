import { ShoppingCart } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    "Get to Know Us": ["About TechMart", "Our Story", "Why Choose Us", "Quality Promise"],
    "Connect with Us": ["Facebook", "Twitter", "Instagram", "Email Us"],
    "Shop Categories": ["Smartphones", "Laptops", "Headphones", "Smart Watches", "Tablets", "Cameras", "All Products"],
    "Customer Service": ["Your Account", "Order History", "Shipping Info", "Returns & Exchanges", "Track Your Order", "Help Center"]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-lg mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-8 h-8" />
            <span className="text-2xl font-bold">TechMart</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="text-center">
              <h4 className="font-bold mb-1">TechMart Electronics</h4>
              <p className="text-sm text-gray-400">Premium gadgets & accessories</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-1">Fast Delivery</h4>
              <p className="text-sm text-gray-400">Quick & secure shipping</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-1">Developer</h4>
              <p className="text-sm text-gray-400">Hariharan V</p>
              <p className="text-sm text-gray-400">+91 987654320</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-400">Always here to help you</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-800">
            © 2025 TechMart. Developed by Hariharan V. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}