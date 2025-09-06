import React, { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./components/HomePage";
import CustomerMenu from "./components/CustomerMenu";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aboutus from "./components/Aboutus";
import "./styles/LoginSignup.css";

function App() {
  const [page, setPage] = useState("home");
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch menu from backend
  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get("/api/menu", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        params: {
          userId: user?.id, // fallback for GET if backend needs it
        },
      });
      setMenu(res.data);
    } catch {
      setMenu([]);
    }
  };

  // Fetch menu on mount and when login/signup occurs
  useEffect(() => {
    fetchMenu();
  }, []);

  // Fetch menu again after login/signup
  const handleLoginSuccess = () => {
    setPage("home");
    fetchMenu(); // Refresh menu after login/signup
  };

  // Add menu item via backend, then refresh menu
  const handleAddMenuItem = async (item) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/menu", item, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      await fetchMenu(); // Refresh menu after adding
    } catch (err) {
      // handle error (e.g., show message)
    }
  };

  // Remove menu item via backend, then refresh menu
  const handleRemoveMenuItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/menu/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      await fetchMenu(); // Refresh menu after removing
    } catch (err) {
      // handle error (e.g., show message)
    }
  };

  const handlePlaceOrder = (order) => {
    setOrders((prev) => [
      ...prev,
      {
        ...order,
        id: Date.now(),
        status: "Pending",
        table: order.table || "N/A", // You can enhance this to collect table info
      },
    ]);
  };

  // Check authentication by token presence
  const isLoggedIn = !!localStorage.getItem("token");

  // If logged in, always show Dashboard
  if (isLoggedIn) {
    return (
      <Dashboard
        menu={menu}
        setMenu={setMenu}
        orders={orders}
        setOrders={setOrders}
        onAddMenuItem={handleAddMenuItem}
        onRemoveMenuItem={handleRemoveMenuItem}
      />
    );
  }

  // Helper to get userId from query string (for customer menu)
  function getUserIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("userId");
  }

  // Show CustomerMenu if page is "menu" or path is "/menu"
  if (page === "menu" || window.location.pathname === "/menu") {
    const userId = getUserIdFromQuery();
    return (
      <CustomerMenu
        menu={menu}
        onBack={() => setPage("home")}
        onPlaceOrder={handlePlaceOrder}
        userId={userId}
      />
    );
  }

  // Show HomePage, LoginPage, or SignupPage
  return (
    <Router>
      <div className="App">
        {page === "home" && (
          <HomePage
            onViewMenu={() => setPage("menu")}
            onLogin={() => setPage("LoginPage")}
            onSignup={() => setPage("SignupPage")}
          />
        )}
        {page === "LoginPage" && <LoginPage onLogin={handleLoginSuccess} />}
        {page === "SignupPage" && (
          <LoginPage signupMode={true} onLogin={handleLoginSuccess} />
        )}
        <Routes>
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/login" element={<LoginPage />} />
          {/* ...other routes... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;