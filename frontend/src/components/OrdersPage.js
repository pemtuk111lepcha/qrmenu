import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OrderPage.css";
import orderBg from "../img/orderbg.jpg";

// OrdersTable component for displaying orders in a table
const OrdersTable = ({ orders }) => (
  <div
    style={{
      maxWidth: 800,
      margin: "2rem auto",
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      padding: "1.5rem",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        color: "#2575fc",
        marginBottom: "1rem",
      }}
    >
      All Orders
    </h2>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "1rem",
      }}
    >
      <thead>
        <tr
          style={{
            background: "#f7af7e",
            color: "#fff",
          }}
        >
          <th
            style={{
              padding: "0.7rem",
              borderRadius: "6px 0 0 0",
            }}
          >
            Date
          </th>
          <th style={{ padding: "0.7rem" }}>Table</th>
          <th style={{ padding: "0.7rem" }}>Items</th>
          <th style={{ padding: "0.7rem" }}>Status</th>
          <th
            style={{
              padding: "0.7rem",
              borderRadius: "0 6px 0 0",
            }}
          >
            Complete
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 && (
          <tr>
            <td
              colSpan={5}
              style={{
                textAlign: "center",
                padding: "1.2rem",
              }}
            >
              No orders yet.
            </td>
          </tr>
        )}
        {orders.map((order, idx) => (
          <tr
            key={order._id || order.id || idx}
            style={{
              borderBottom: "1px solid #eee",
            }}
          >
            <td
              style={{
                padding: "0.7rem",
                color: "#444",
              }}
            >
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-"}
            </td>
            <td
              style={{
                padding: "0.7rem",
                color: "#444",
              }}
            >
              {order.table || "-"}
            </td>
            <td
              style={{
                padding: "0.7rem",
                color: "#444",
              }}
            >
              {Array.isArray(order.items)
                ? order.items.join(", ")
                : order.items}
            </td>
            <td
              style={{
                padding: "0.7rem",
                color:
                  order.status === "Completed"
                    ? "#22c55e"
                    : "#f97316",
                fontWeight: "bold",
              }}
            >
              {order.status || "-"}
            </td>
            <td
              style={{
                padding: "0.7rem",
                textAlign: "center",
              }}
            >
              {order.status !== "Completed" && (
                <input
                  type="checkbox"
                  title="Mark as Completed"
                  onChange={() =>
                    order.handleComplete(order._id || order.id)
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              )}
              {order.status === "Completed" && (
                <span
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from backend on mount
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        let ordersArr = [];
        if (Array.isArray(res.data)) {
          ordersArr = res.data;
        } else if (res.data && Array.isArray(res.data.orders)) {
          ordersArr = res.data.orders;
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
          ordersArr = res.data.data;
        }
        // Attach handleComplete to each order for the table
        setOrders(
          ordersArr.map((order) => ({
            ...order,
            handleComplete: handleComplete,
          }))
        );
      } catch (err) {
        setOrders([]);
      }
    };
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleComplete = async (id) => {
    await axios.patch(`/api/orders/${id}`, { status: "Completed" });
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status: "Completed" } : order
      )
    );
  };

  return (
    <div
      className="orders-section"
      style={{
        backgroundImage: `url('${orderBg}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 2rem",
        backgroundSize: "cover",
        alignContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "800px",
        color: "white",
      }}
    >
      <OrdersTable orders={orders} />
    </div>
  );
};

export default OrdersPage;