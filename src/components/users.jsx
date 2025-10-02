import React, { useState, useEffect, useContext } from "react";
import AppContext from "./context/appContext";
import { Link } from "react-router-dom";

const Users = () => {
  const { getTransactions, getCashTransactions, getInstalmentTransactions } =
    useContext(AppContext);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // ✅ "all" | "cash" | "instalments"

  const fetchData = async (selectedFilter) => {
    setLoading(true);
    let data = [];
    if (selectedFilter === "all") {
      data = await getTransactions();
    } else if (selectedFilter === "cash") {
      data = await getCashTransactions();
    } else if (selectedFilter === "instalments") {
      data = await getInstalmentTransactions();
      console.log(data)
    }
    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(filter); // ✅ load on mount & whenever filter changes
  }, [filter]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="px-5">Users</h1>
        <div>
          <Link to="/dashboard/recycle">
            <button type="button" className="btn btn-outline-danger mx-2">
              Recycle
            </button>
          </Link>
        </div>
      </div>

      {/* ✅ Filter Buttons */}
      <div className="d-flex justify-content-center my-3">
        <button
          className={`btn mx-2 ${
            filter === "all" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn mx-2 ${
            filter === "cash" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setFilter("cash")}
        >
          Cash
        </button>
        <button
          className={`btn mx-2 ${
            filter === "instalments" ? "btn-warning" : "btn-outline-warning"
          }`}
          onClick={() => setFilter("instalments")}
        >
          Instalments
        </button>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container-fluid p-4">
          {transactions.length === 0 ? (
            <p>No transactions available</p>
          ) : (
            transactions.reverse().map((txn, idx) => (
              <div
                key={txn._id || idx}
                className="card mb-3 rounded-4 shadow-sm position-relative"
              >
                <span className="position-absolute top-0 p-3 start-0 translate-middle badge border border-light rounded-circle bg-primary">
                  <span className="visually-hidden">New alerts</span>
                </span>
                <div className="row g-0 d-flex align-items-center">
                  <div className="col-md-11">
                    <Link
                      to={`/dashboard/update-transactions/${txn._id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="card-body mx-2">
                        <h5 className="card-title">{txn.fullName}</h5>
                        <div className="d-flex flex-column">
                          <span className="card-text">
                            Payment Method: <b>{txn.transactionType}</b>
                          </span>
                          <span>
                            Amount:{" "}
                            <b>PKR {txn.installmentPrice || txn.cashPrice}</b>
                          </span>
                        </div>
                        <p className="card-text">
                          <small className="text-body-secondary">
                            Date {new Date(txn.date).toLocaleString()}
                          </small>
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* ✅ Right aligned column */}
                  {txn.transactionType === "instalments" && (
  <div
    className="col-md-1 d-flex justify-content-end"
    style={{ color: "orange" }}
  >
    <p className="m-4 fw-bold">
      {txn.installments
        .filter(ins => ins.status !== "Paid") // ✅ only Pending
        .reduce((acc, ins) => acc + ins.amount, 0) // ✅ sum remaining
        .toLocaleString("en-PK", { style: "currency", currency: "PKR" })}
    </p>
  </div>
)}

                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
