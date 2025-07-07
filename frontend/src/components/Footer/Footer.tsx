import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Made with ❤️ by{" "}
        <a
          href="https://github.com/stefanbobrowski/gglist"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Stefan Bobrowski
        </a>
      </p>
      <Link to="/privacy">Privacy Policy</Link>
    </footer>
  );
};
