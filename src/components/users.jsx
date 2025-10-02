import React, { useState, useEffect, useContext } from "react";
import AppContext from "./context/appContext";
import { Link, useParams } from "react-router-dom";

const Users = () => {
  const {
    getTransactions,
    getCashTransactions,
    getInstalmentTransactions,
    getPendingInstalmentTransactions,
    getFullyPaidInstalmentTransactions,
    getDueInstalmentTransactions,
  } = useContext(AppContext);

  const { filter: routeFilter } = useParams(); // ✅ read filter from URL
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(routeFilter || "all"); // ✅ default to "all" if no param

  const fetchData = async (selectedFilter) => {
    setLoading(true);
    let data = [];

    if (selectedFilter === "all") {
      data = await getTransactions();
    } else if (selectedFilter === "cash") {
      data = await getCashTransactions();
    } else if (selectedFilter === "instalments") {
      data = await getInstalmentTransactions();
    } else if (selectedFilter === "pending") {
      data = await getPendingInstalmentTransactions();
    } else if (selectedFilter === "fully-paid") {
      data = await getFullyPaidInstalmentTransactions();
    } else if (selectedFilter === "due") {
      data = await getDueInstalmentTransactions();
    }

    setTransactions(data || []);
    setLoading(false);
  };

  // ✅ when URL changes or filter changes, fetch data
  useEffect(() => {
    if (routeFilter) {
      setFilter(routeFilter); // update filter state from URL
    }
  }, [routeFilter]);

  useEffect(() => {
    fetchData(filter);
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
      <div className="d-flex justify-content-center my-3 flex-wrap">
        <Link to="/dashboard/users/all">
          <button
            className={`btn mx-2 ${
              filter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </Link>

        <Link to="/dashboard/users/cash">
          <button
            className={`btn mx-2 ${
              filter === "cash" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setFilter("cash")}
          >
            Cash
          </button>
        </Link>

        <Link to="/dashboard/users/instalments">
          <button
            className={`btn mx-2 ${
              filter === "instalments"
                ? "btn-warning"
                : "btn-outline-warning"
            }`}
            onClick={() => setFilter("instalments")}
          >
            Instalments
          </button>
        </Link>

        <Link to="/dashboard/users/pending">
          <button
            className={`btn mx-2 ${
              filter === "pending" ? "btn-info" : "btn-outline-info"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending Instalments
          </button>
        </Link>

        <Link to="/dashboard/users/fully-paid">
          <button
            className={`btn mx-2 ${
              filter === "fully-paid" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFilter("fully-paid")}
          >
            Fully Paid
          </button>
        </Link>

        <Link to="/dashboard/users/due">
          <button
            className={`btn mx-2 ${
              filter === "due" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => setFilter("due")}
          >
            Due Instalments
          </button>
        </Link>
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
            transactions
              .slice()
              .reverse()
              .map((txn, idx) => (
                <div
                  key={txn._id || idx}
                  className="card mb-3 rounded-4 shadow-sm"
                >
                  {(() => {
    let badgeClass = "bg-primary"; // default blue
    if (txn.transactionType === "instalments") {
      const hasDue = txn.installments.some(ins => ins.status === "Due");
      const allPaid = txn.installments.every(ins => ins.status === "Paid");

      if (allPaid) badgeClass = "bg-success"; // green
      else if (hasDue) badgeClass = "bg-danger"; // red
    }

    return (
      <span
        className={`position-absolute top-0 p-3 start-0 translate-middle badge border border-light rounded-circle ${badgeClass}`}
      >
        <span className="visually-hidden">Status Badge</span>
      </span>
    );
  })()}
                  <div className="row g-0 d-flex align-items-center">
                    <div className="col-md-11">
                      <Link
                        to={`/dashboard/update-transactions/${txn._id}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="card-body mx-2">
                          <h5 className="card-title">{txn.fullName}</h5>
                          <div className="d-flex flex-column">
                            <span>
                              Payment Method: <b>{txn.transactionType}</b>
                            </span>
                            <span>
                              Amount:{" "}
                              <b>
                                PKR {txn.installmentPrice || txn.cashPrice}
                              </b>
                            </span>
                          </div>
                          <p className="card-text">
                            <small className="text-body-secondary">
                              Date{" "}
                              {new Date(txn.date).toLocaleDateString("en-GB")}
                            </small>
                          </p>
                        </div>
                      </Link>
                    </div>
                    {txn.transactionType === "instalments" && (
                      <div
                        className="col-md-1 d-flex justify-content-end"
                        style={{ color: "orange" }}
                      >
                        <p className="m-4 fw-bold">
                          {(() => {
                            const remaining = txn.installments
                              .filter((ins) => ins.status !== "Paid")
                              .reduce((acc, ins) => acc + ins.amount, 0);

                            return remaining === 0 ? (
                              <span className="text-success fw-bold">Paid</span>
                            ) : (
                              <span>
                                {remaining.toLocaleString("en-PK", {
                                  style: "currency",
                                  currency: "PKR",
                                })}
                              </span>
                            );
                          })()}
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
