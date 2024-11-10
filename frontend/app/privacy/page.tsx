export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Name and contact information</li>
              <li>Farm location and size</li>
              <li>Crop selection and farming practices</li>
              <li>Weather data related to your location</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Provide personalized crop recommendations</li>
              <li>Send weather alerts and farming tips</li>
              <li>Improve our services and user experience</li>
              <li>Analyze farming trends and patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We implement appropriate security measures to protect your personal information. 
              Your data is encrypted during transmission and stored securely on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about our privacy policy, please contact us at privacy@farmnest.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
