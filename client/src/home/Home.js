import "./Home.css";
import logo from "../img/nobg-logo.png";

import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <header className="home-header">
        <nav className="home-navigation">
          <div className="home-logo">
            <img src={logo} alt="Godfather Bank Logo" />
            <h1>El7a2ny</h1>
          </div>
          <ul>
            <li>
              <a href="/" className="active">
                Home
              </a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact us</a>
            </li>
          </ul>
          <div className="home-user-area">
            <Link to="/login">
              <button className="home-login-button">Login</button>
            </Link>
            <Link to="/register-patient">
              <button className="home-register-button">Register</button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="home-content">
        <div className="home-hero-section">
          <h2>Welcome To El7a2ny</h2>
          <p>TRUST YOU MUST</p>
        </div>
        <div className="home-features-section">
          <div className="home-feature-card">
            <div className="homefeature-icon">
              <i className="home-fas fa-wallet"></i>
            </div>
            <h3>Welcome To Your Virtual Clinic</h3>
            <p>
              Experience the future of healthcare with our virtual clinic
              software. Connect with your healthcare provider from the comfort
              of your home, making appointments, sharing medical records, and
              receiving expert medical guidance seamlessly.
            </p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <i className="home-fas fa-money-check-alt"></i>
            </div>
            <h3>Quality Care, Anytime, Anywhere</h3>
            <p>
              Our virtual clinic software ensures that you have access to
              quality healthcare services 24/7. Whether you need a consultation,
              prescription refills, or follow-up appointments, our platform is
              here to provide convenient and reliable healthcare support.
            </p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <i className="home-fas fa-credit-card"></i>
            </div>
            <h3>Your Health, Your Control</h3>
            <p>
              Take charge of your health with our virtual clinic software.
              Monitor your health records, schedule appointments, and receive
              personalized medical advice all in one place. Your health, your
              way, with the ease and flexibility of our virtual clinic system.
            </p>
          </div>
        </div>
        <div className="home-learn-more-container">
          <button className="home-learn-more-button">Learn More</button>
        </div>
      </main>
    </div>
  );
}

export default Home;
