// Removed: import "../styles/CreateMenu.css"; // Styles are now embedded below

import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import "../styles/CreateMenu.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const BACKEND_URL = "http://localhost:5000"; // Add this line

// Analytics component that uses orders and menu as props
const AnalyticsInsights = ({ orders = [], menu = [] }) => {
  // Calculate most viewed categories/dishes
  const analytics = useMemo(() => {
    // Count dish views (orders)
    const dishCount = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        dishCount[item] = (dishCount[item] || 0) + 1;
      });
    });
    // Sort dishes by count
    const mostViewedDishes = Object.entries(dishCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Peak scan times (by hour)
    const hourCount = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const hour = new Date(order.createdAt).getHours();
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      }
    });
    const peakHours = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([hour]) => `${hour}:00 - ${parseInt(hour) + 1}:00`);

    // Heatmap (simulate with dish count for now)
    const max = Math.max(...Object.values(dishCount), 1);

    return {
      mostViewedDishes,
      peakHours,
      heatmap: dishCount,
      max,
    };
  }, [orders]);

  // --- Export Handlers ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    doc.text("Orders Report", 14, 16);
    doc.setFontSize(10);
    doc.setTextColor("#888");
    doc.text(`Generated: ${dateStr}`, 14, 22);
    doc.setFontSize(12);
    doc.setTextColor("#222");
    autoTable(doc, {
      startY: 28,
      head: [["Date", "Table", "Items", "Status"]],
      body: orders.map(order => [
        // Show order date from order.date or order.createdAt or fallback to "-"
        order.date
          ? new Date(order.date).toLocaleString()
          : order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "-",
        order.table || "-",
        Array.isArray(order.items) ? order.items.join(", ") : order.items,
        order.status || "-"
      ]),
    });
    doc.save("orders-report.pdf");
  };

  const handleExportExcel = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    const wsData = [
      ["Orders Report"],
      [`Generated: ${dateStr}`],
      [],
      ["Date", "Table", "Items", "Status"],
      ...orders.map(order => [
        order.date
          ? new Date(order.date).toLocaleString()
          : order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "-",
        order.table || "-",
        Array.isArray(order.items) ? order.items.join(", ") : order.items,
        order.status || "-"
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders-report.xlsx");
  };

  return (
    <div className="analytics-insights-container">
      <h3 className="analytics-insights-title">Analytics & Insights</h3>
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="analytics-section-label">Most Viewed Dishes</span>
        <ul className="analytics-list">
          {analytics.mostViewedDishes.length === 0 && <li>No data yet.</li>}
          {analytics.mostViewedDishes.map(([dish, count]) => (
            <li key={dish}>• {dish} ({count} views)</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="analytics-section-label">Peak Scan Times</span>
        <ul className="analytics-list">
          {analytics.peakHours.length === 0 && <li>No data yet.</li>}
          {analytics.peakHours.map((range, idx) => (
            <li key={idx}>• {range}</li>
          ))}
        </ul>
      </div>
      <div>
        <span className="analytics-heatmap-label">Customer Interaction Heatmap</span>
        <div className="analytics-heatmap-bar">
          {Object.entries(analytics.heatmap).map(([dish, count]) => (
            <div className="analytics-heatmap-bar-segment" key={dish}>
              <div
                className="analytics-heatmap-bar-segment-bar"
                style={{
                  height: `${(count / analytics.max) * 60 + 10}px`,
                }}
                title={`${dish}: ${count} views`}
              ></div>
              <span className="analytics-heatmap-bar-segment-count">{count}</span>
              <span className="analytics-heatmap-bar-segment-label">{dish}</span>
            </div>
          ))}
          {Object.keys(analytics.heatmap).length === 0 && (
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 12, marginLeft: 10 }}>
              No data yet.
            </span>
          )}
        </div>
      </div>
      <div className="analytics-export-btns">
        <button onClick={handleExportPDF} className="analytics-export-btn">
          Export PDF
        </button>
        <button onClick={handleExportExcel} className="analytics-export-btn">
          Export Excel
        </button>
      </div>
    </div>
  );
};

// CreateMenuPage component for adding new food items
function CreateMenuPage({ menu: initialMenu = [], setMenu, onAddItem, onRemoveItem, orders = [] }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [menu, setMenuState] = useState(initialMenu);
  const [orderData, setOrderData] = useState(orders); // <-- Add this line

  // Always fetch menu after add/remove
  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get("/api/menu", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        params: {
          userId: user?.id,
        },
      });
      setMenuState(res.data);
      if (setMenu) setMenu(res.data);
    } catch {
      setMenuState([]);
      if (setMenu) setMenu([]);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      // Accept array or {orders: [...]}
      let ordersArr = [];
      if (Array.isArray(res.data)) {
        ordersArr = res.data;
      } else if (res.data && Array.isArray(res.data.orders)) {
        ordersArr = res.data.orders;
      }
      setOrderData(ordersArr);
    } catch {
      setOrderData([]);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders(); // <-- Fetch orders on mount and refresh
    // eslint-disable-next-line
  }, []);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  // Function to handle form submission for adding menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!itemName || !itemPrice || !itemImage) {
      setMessage('Please fill in all fields.');
      return;
    }
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("price", itemPrice);
    formData.append("image", itemImage);

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/menu", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage('Menu item added successfully!');
      setItemName('');
      setItemPrice('');
      setItemImage(null);
      setImagePreview('');
      await fetchMenu(); // Always refresh menu after add
      if (onAddItem) await onAddItem();
    } catch (err) {
      setMessage('Failed to add menu item.');
    }
  };

  // Remove handler
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this menu item?")) {
      await onRemoveItem(id);
      await fetchMenu(); // Always refresh menu after remove
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    let relPath = image.replace(/^\/?uploads\//, "");
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    if (image.startsWith("/uploads/") || image.startsWith("uploads/")) {
      const parts = relPath.split("/");
      if (parts.length > 1) {
        const filename = encodeURIComponent(parts.pop());
        return `${BACKEND_URL}/uploads/${parts.join("/")}/${filename}`;
      }
      return `${BACKEND_URL}/uploads/${encodeURIComponent(relPath)}`;
    }
    return `${BACKEND_URL}/uploads/${encodeURIComponent(image)}`;
  };

  return (
    <div>
      <div className="main-menu">
        <div class="main-div">
          <div className="menu-header">
            <div className="form-div">
              <h1 className="header1">
                Create New Menu Item
              </h1>
              <form onSubmit={handleSubmit} className="menu-form" encType="multipart/form-data">
                {/* Item Name */}
                <div>
                  <label htmlFor="itemName" className="label">
                    Food Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="input"
                    placeholder="e.g., Spicy Chicken Wings"
                    required
                  />
                </div>

                {/* Item Price */}
                <div>
                  <label htmlFor="itemPrice" className="label">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="itemPrice"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="input"
                    placeholder="e.g., 299.00"
                    step="0.01" // Allow decimal values
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label htmlFor="itemImage" className="label">
                    Image
                  </label>
                  <input
                    type="file"
                    id="itemImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input"
                    required
                  />
                  {/* Removed image preview */}
                </div>
                {/* Submission Button */}
                <button
                  type="submit"
                  className="button"
                >
                  Add Menu Item
                </button>
                {/* Message display for success/error */}
                {message && (
                  <p className={`mt-4 text-center text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
          {/* Created Items section */}
          <div className="created-item" style={{ position: "relative" }}>
            <h1
              className="header"
              style={{
                position: "sticky",
                top: 0,
                background: "#f7af7e",
                zIndex: 2,
                margin: 0,
                padding: "0.5rem 0 0.5rem 0"
              }}
            >
              Created Menu Items
            </h1>
            <div>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {menu.length === 0 && <li>No menu items yet.</li>}
                {menu.map(item => (
                  <li key={item._id || item.id} style={{ margin: "1rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {item.image && <img src={getImageUrl(item.image)} alt={item.name} style={{ width: 50, height: 35, objectFit: "cover", borderRadius: 4 }} />}
                      <span>{item.name} - ₹{item.price}</span>
                    </div>
                    <button
                      className="button"
                      style={{ background: "#fff", color: "brown", border: "1px solid brown", width: "auto", padding: "0.2rem 1rem", marginLeft: "1rem" }}
                      onClick={() => handleRemove(item._id || item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Back to Menu button */}
          {/* <button
              onClick={onBackToMenu}
              className="button2"
            >
              Back to Menu
            </button> */}
        </div>
      </div>
      <AnalyticsInsights orders={orderData} menu={menu} />
    </div >
  );
}

export default CreateMenuPage;


