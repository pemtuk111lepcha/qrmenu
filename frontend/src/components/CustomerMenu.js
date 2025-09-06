import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CustomerMenu.css";

const BACKEND_URL = "http://localhost:5000";

const CustomerMenu = ({ menu: initialMenu = [], onBack, onPlaceOrder, userId }) => {
  const [menu, setMenu] = useState(initialMenu);
  const [table, setTable] = useState("");
  const [bookOpen, setBookOpen] = useState(false);

  // Fetch menu for customer if userId is provided
  useEffect(() => {
    if (userId) {
      axios.get("/api/menu", { params: { userId } })
        .then(res => setMenu(res.data))
        .catch(() => setMenu([]));
    }
  }, [userId]);

  const handleOrder = async (item) => {
    if (!table) {
      alert("Please enter your table number.");
      return;
    }
    const confirmOrder = window.confirm(`Place order for "${item.name}" at table ${table}?`);
    if (!confirmOrder) return;

    // Send order to backend
    try {
      await axios.post("/api/orders", {
        items: [item.name],
        menuItemId: item._id || item.id,
        status: "Pending",
        table,
      });
      alert("Order placed successfully!");
    } catch (err) {
      alert("Failed to place order. Please try again.");
    }

    // If you want to call onPlaceOrder for local state/UI update, keep this:
    onPlaceOrder &&
      onPlaceOrder({
        items: [item.name],
        menuItemId: item._id || item.id,
        status: "Pending",
        table,
      });
  };

  // Add debug logging and show image URL in UI
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    let relPath = image.replace(/^\/?uploads\//, "");
    const parts = relPath.split("/");
    const filename = encodeURIComponent(parts.pop());
    const folder = parts.length ? parts.join("/") + "/" : "";
    const url = `${BACKEND_URL}/uploads/${folder}${filename}`;
    return url;
  };

  // Divide menu items equally among the three pages
  const pageCount = 3;
  const perPage = Math.ceil(menu.length / pageCount);
  const menuPages = [
    menu.slice(0, perPage), // cover-back (first page)
    menu.slice(perPage, perPage * 2), // final-page (second page)
    menu.slice(perPage * 2), // page-1-back (third page)
  ];

  return (
    <div className="customer-menu-container">
      {/* Book Opening Effect */}
      <div className="app-container">
        <div
          className={`book${bookOpen ? " open" : ""}`}
          onClick={() => setBookOpen((open) => !open)}
          style={{ cursor: "pointer" }}
        >
          <div className="final-page">
            <h2>Menu</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "center", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {menuPages[1].map((item) => (
                <li key={item._id || item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
          <div className="page-1">
            <div className="face page-1-front">
              {/* You can add content for the right page if needed */}
            </div>
            <div className="face page-1-back">
              <h2>Menu</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "center", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {menuPages[2].map((item) => (
                  <li key={item._id || item.id}>{item.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="cover">
            <div className="face cover-front">
              <div className="cover-title">The Magic of CSS</div>
              <p>By A. Developer</p>
            </div>
            <div className="face cover-back">
              <h2>Menu</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "center", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {menuPages[0].map((item) => (
                  <li key={item._id || item.id}>{item.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <label>
          Table Number:{" "}
          <input
            type="text"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            placeholder="Enter table number"
            style={{
              padding: "0.3rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>
      <section className="menu-cards-section">
        {menu.length === 0 && (
          <div style={{ textAlign: "center", width: "100%" }}>
            No menu items available.
          </div>
        )}
        {menu.map((item) => {
          const imgUrl = getImageUrl(item.image);
          return (
            <article key={item._id || item.id} className="menu-card">
              <img
                src={imgUrl || "https://placehold.co/180x120?text=No+Image"}
                alt={item.name}
                style={{
                  width: "180px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/180x120?text=No+Image";
                }}
              />
              <h3>{item.name}</h3>
              <span>
                Price: <b>{item.price}/-</b>
              </span>
              <button
                className="order-now-btn"
                type="button"
                onClick={() => handleOrder(item)}
              >
                Order Now
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default CustomerMenu;