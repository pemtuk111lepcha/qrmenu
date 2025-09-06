import React, { useState } from "react";
import "../styles/navbar.css";
import CreateMenuPage from "./CreateMenuPage";
import GenerateQRCodePage from "./GenerateQRCodePage";
import OrdersPage from "./OrdersPage";
import CustomerMenu from "./CustomerMenu";
import Footer from "./footer";
import Aboutus from "./Aboutus"; // Import Aboutus

const NavBar = ({ menu, setMenu, orders, setOrders, onAddMenuItem, onRemoveMenuItem, onPlaceOrder }) => {
  const [activeSection, setActiveSection] = useState("menu");

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Or you can call a prop to update isLoggedIn in App
  };

  let content = null;
  if (activeSection === "menu") {
    // Pass orders and menu to CreateMenuPage for analytics
    content = (
      <CreateMenuPage
        menu={menu}
        setMenu={setMenu}
        onAddItem={onAddMenuItem}
        onRemoveItem={onRemoveMenuItem}
        orders={orders}
      />
    );
  } else if (activeSection === "qrcode") {
    content = <GenerateQRCodePage />;
  } else if (activeSection === "orders") {
    content = <OrdersPage orders={orders} setOrders={setOrders} />;
  } else if (activeSection === "customerMenu") {
    content = <CustomerMenu menu={menu} onPlaceOrder={onPlaceOrder} />;
  } else if (activeSection === "aboutus") {
    content = <Aboutus />;
  }

  return (
    <div>
      <div className="home-top-navbar">
        <div className="app-logo">
          <span>QR Menu</span>
        </div>
        <nav className="home-navbar">
          <button
            className={activeSection === "menu" ? "active" : ""}
            onClick={() => setActiveSection("menu")}
          >
            Create Menu
          </button>
          <button
            className={activeSection === "qrcode" ? "active" : ""}
            onClick={() => setActiveSection("qrcode")}
          >
            Generate QR Code
          </button>
          <button
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => setActiveSection("orders")}
          >
            Orders
          </button>
          <button
            className={activeSection === "customerMenu" ? "active" : ""}
            onClick={() => setActiveSection("customerMenu")}
          >
            Menu
          </button>
          <button
            className={activeSection === "aboutus" ? "active" : ""}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveSection("aboutus")}
          >
            About US
          </button>
          {/* Logout icon */}
          <button
            className="logout-btn"
            title="Logout"
            style={{ background: "none", border: "none", marginLeft: "1rem", cursor: "pointer" }}
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt" style={{ fontSize: "1.5rem", color: "brown" }}></i>
          </button>
        </nav>
      </div>
      {content}
      <Footer />
    </div>
  );
};

export default NavBar;