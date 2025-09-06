import React from "react";
import "../styles/Dashboard.css";
import NavBar from "./NavBar";

const Dashboard = ({ menu, setMenu, orders, setOrders, onAddMenuItem, onRemoveMenuItem }) => {
  // Pass handlePlaceOrder to NavBar
  const handlePlaceOrder = (order) => {
    setOrders((prev) => [
      ...prev,
      {
        ...order,
        id: Date.now(),
        status: "Pending",
        table: order.table || "N/A",
      },
    ]);
  };

  return (
    <div className="dashboard-container">
      <NavBar
        menu={menu}
        setMenu={setMenu}
        orders={orders}
        setOrders={setOrders}
        onAddMenuItem={onAddMenuItem}
        onRemoveMenuItem={onRemoveMenuItem}
        onPlaceOrder={handlePlaceOrder}
      />
      {/* AnalyticsInsights removed from Dashboard */}
    </div>
  );
};

export default Dashboard;