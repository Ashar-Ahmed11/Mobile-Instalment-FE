import React, { useEffect, useContext, useState } from "react";
import AppContext from "./context/appContext";
import { Link } from "react-router-dom";

const RecyclePage = () => {
  const { getRecycledTransactions, updateTransaction, deleteTransaction } =
    useContext(AppContext);

  const [allRecycledTxn, setAllRecycledTxn] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Modal state
  const [modal, setModal] = useState({ show: false, type: "", txn: null });

  const recycleFunc = async () => {
    setLoading(true);
    const recycleTxn = await getRecycledTransactions();
    setAllRecycledTxn(recycleTxn || []);
    setLoading(false);
  };

  useEffect(() => {
    recycleFunc();
  }, []);

  const handleRestore = async (txn) => {
    await updateTransaction(txn._id, { ...txn, recycled: false });
    recycleFunc();
  };

  const handlePermanentDelete = async (id) => {
    await deleteTransaction(id);
    recycleFunc();
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1 className="px-5">Recycle Page</h1>
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
          {allRecycledTxn.length === 0 ? (
            <p>No transactions available</p>
          ) : (
            allRecycledTxn.map((txn, idx) => (
              <div
                key={txn._id || idx}
                className="card mb-3 rounded-4 shadow-sm position-relative"
              >
                   {txn.transactionType === "instalments" && (() => {
  let badgeClass = "bg-primary";
  const hasDue = txn.installments.some(ins => ins.status === "Due");
  const allPaid = txn.installments.every(ins => ins.status === "Paid");

  if (allPaid) badgeClass = "bg-success"; 
  else if (hasDue) badgeClass = "bg-danger";

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
                          <span className="card-text">
                            Payment Method: <b>{txn.transactionType}</b>
                          </span>
                          <span>
                            Amount: <b>PKR {txn.installmentPrice || txn.cashPrice}</b>
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

                  {/* ✅ Right aligned buttons */}
                  <div className="col-md-1 d-flex flex-column align-items-end pe-3">
                    {txn.transactionType === "instalments" && (
                      <p className="m-0 fw-bold text-warning me-2">
                        {txn.installmentPrice - txn.advanceInstalment}
                      </p>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() =>
                          setModal({ show: true, type: "restore", txn })
                        }
                      >
                        Restore
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          setModal({ show: true, type: "delete", txn })
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ✅ Modal Component */}
      {modal.show && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modal.type === "delete"
                    ? "Confirm Permanent Delete"
                    : "Confirm Restore"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal({ show: false, type: "", txn: null })}
                />
              </div>
              <div className="modal-body">
                <p>
                  {modal.type === "delete"
                    ? "Are you sure you want to permanently delete this transaction?"
                    : "Are you sure you want to restore this transaction?"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModal({ show: false, type: "", txn: null })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={
                    modal.type === "delete"
                      ? "btn btn-danger"
                      : "btn btn-success"
                  }
                  onClick={async () => {
                    if (modal.type === "delete") {
                      await handlePermanentDelete(modal.txn._id);
                    } else {
                      await handleRestore(modal.txn);
                    }
                    setModal({ show: false, type: "", txn: null });
                  }}
                >
                  {modal.type === "delete" ? "Delete" : "Restore"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclePage;
