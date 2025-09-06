import React from 'react';
// Removed: import "../styles/footer.css" // CSS is now embedded below

function Footer() {
  return (
    // The main footer section, now with embedded CSS
    <footer className="footer">
      {/* Embedded CSS for the Footer component */}
      <style>
        {`
        .footer {
            background-color: #111;
            color: #fff;
            padding: 50px 0;
            font-family: monospace;
        }

        .footer .credit {
            padding: 2.5rem 1rem;
            color:rgb(102, 255, 0);
            font-weight: normal;
            font-size: 1.5rem;
            text-align: center;
            text-decoration: none;
        }

        .footer .credit span {
            color:rgb(81, 255, 0);
        }

        .container {
            display: flex;
            justify-content: space-around;
            max-width: 1200px;
            margin: 0 auto;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .footer-content {
            flex: 1;
            padding: 0 20px;
            text-decoration: none;
            min-width: 250px;
            text-align: center;
            color: #fff;
        }

        @media (max-width: 768px) {
            .footer-content {
                margin-bottom: 20px;
            }
        }

        .footer-content h3 {
            font-size: 1.7rem;
            margin-bottom: 20px;
            text-align: left;
            color:rgb(43, 255, 0);
        }

        .footer-content ul {
            list-style: none;
            padding: 0;
        }

        .footer-content ul li {
            font-size: 1.1rem;
            margin-bottom: 10px;
            text-align: left;
            color: #fff;
        }

        .footer-content ul li a {
            text-decoration: none;
            color:rgb(81, 255, 0);
            transition: color 0.3s ease;
        }

        .footer-content ul li a:hover {
            color: #fff;
        }

        .social-icons {
            display: flex;
            padding: 0;
            justify-content: left;
            margin-top: 15px;
        }
        .social-icons li {
            margin: 0 10px;
            list-style: none;
        }

        .social-icons a {
            color:rgb(98, 252, 9);
            font-size: 24px;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .social-icons a:hover {
            color: #fff;
        }
        `}
      </style>

      {/* Link to Font Awesome for social icons - ensure this is loaded globally in public/index.html */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" xintegrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />

      <div className="container">
        {/* Contact Us Section */}
        <div className="footer-content">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: pemtuk.lepcha@msu.edu.in</li>
            <li>Phone: +91 9735342063</li>
            <li>Address: Bermiok, West Sikkim, 737111, SIKKIM, INDIA</li>
          </ul>
        </div>

        {/* Quick Links Section - Removed */}

        {/* Follow Us Section */}
        <div className="footer-content">
          <h3>Follow Us</h3>
          <ul className="social-icons">
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a></li>
          </ul>
        </div>
      </div>
      {/* Credit Section */}
      <h1 className="credit">
        Created By <span><a href="#" target="_blank" rel="noopener noreferrer">PEMTUK LEPCHA</a></span> | all rights are reserved
      </h1>
    </footer>
  );
}

export default Footer;
