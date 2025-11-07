import { Package, Shield, HelpCircle } from 'lucide-react';
import Header from '../components/Header';

export default function CustomerHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header auto-handles login/cart from context */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Customer Help Center</h1>
        <p className="text-gray-600 mb-8">
          We're here to help! Find answers to common questions or get in touch with our support team.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Order Support</h3>
              <p className="text-gray-600 text-sm">Track orders, returns, and shipping issues</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Account Security</h3>
              <p className="text-gray-600 text-sm">Password reset, account protection</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Technical Support</h3>
              <p className="text-gray-600 text-sm">Website issues and technical problems</p>
            </div>

          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">How do I track my order?</h3>
                <p className="text-gray-600 text-sm">
                  Go to **My Orders** in your profile after logging in.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">What is your return policy?</h3>
                <p className="text-gray-600 text-sm">
                  We offer a **30-day return window** for most products.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">How long does shipping take?</h3>
                <p className="text-gray-600 text-sm">
                  Standard: **3-5 days** • Express: **1-2 days**
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
