export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing and using FarmNest, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              FarmNest grants you a personal, non-transferable license to use our services for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Accessing crop recommendations</li>
              <li>Viewing weather forecasts</li>
              <li>Managing farm data</li>
              <li>Participating in the farming community</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The information provided through FarmNest is for general guidance only. 
              While we strive for accuracy, we make no guarantees regarding the results 
              of using our recommendations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Users are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Providing accurate information</li>
              <li>Maintaining account security</li>
              <li>Complying with local farming regulations</li>
              <li>Using the service responsibly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions about these terms, please contact us at legal@farmnest.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
