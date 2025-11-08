export default function PrivacyPage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>My Personality G</strong>, we value your privacy. This app reads limited Gmail content
        (such as message text or metadata) only after you grant explicit permission through Google OAuth.
      </p>
      <p className="mb-4">
        The information is used solely to analyze your communication style and estimate MBTI personality traits.
        We do not store, sell, or share your Gmail data with any third parties.
      </p>
      <p className="mb-4">
        You may revoke access anytime from your{" "}
        <a
          href="https://myaccount.google.com/permissions"
          className="text-blue-600 underline"
          target="_blank"
        >
          Google Account settings
        </a>.
      </p>
      <p className="mb-4">
        For questions or data removal requests, please contact us at{" "}
        <a href="mailto:youremail@example.com" className="text-blue-600 underline">
          ovais.00700@gmail.com
        </a>.
      </p>
      <p>Last updated: November 2025</p>
    </main>
  );
}