// src/pages/PrivacyPolicy.tsx
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Privacy Policy for GGList.app</h1>
        <p>
          <strong>Effective Date:</strong> July 7, 2025
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect Google Sign-In data (your name, email, and profile
          picture), your favorites, and anonymous usage data. We also use Google
          AdSense.
        </p>

        <h2>2. Cookies and Tracking</h2>
        <p>
          Cookies help us manage logins and show ads. Learn more{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>

        <h2>3. How We Use Your Data</h2>
        <p>
          We use your data to personalize your experience and improve the site.
          We do not sell your info.
        </p>

        <h2>4. Your Choices</h2>
        <p>
          You can request your data be removed by contacting{" "}
          <a href="mailto:stefanbobrowski1@gmail.com">
            stefanbobrowski1@gmail.com
          </a>
          .
        </p>

        <h2>5. Updates</h2>
        <p>
          This policy may change as needed. Updates will be posted on this page.
        </p>
      </main>
      <Footer />
    </>
  );
}
