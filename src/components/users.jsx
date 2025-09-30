import React, { useState, useEffect, useContext } from "react";
import AppContext from "./context/appContext";
import { Link } from "react-router-dom";

const Users = () => {
  const { getTransactions } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // start loading
      const allTransactions = await getTransactions();
      console.log("Transactions from API:", allTransactions);
      setTransactions(allTransactions || []);
      setLoading(false); // stop loading
    };
    fetchData();
  }, [getTransactions]);

  return (
    <div>
      <h1 className="px-4">Users</h1>

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
            transactions.map((txn, idx) => (
              <div
                key={txn._id || idx}
                className="card mb-3 rounded-4 shadow-sm position-relative"
              >
                <span className="position-absolute top-0 p-3 start-0 translate-middle badge border border-light rounded-circle bg-primary">
                  <span className="visually-hidden">New alerts</span>
                </span>
                <div className="row g-0">
                  <div className="col-md-1 align-items-center d-flex">
                    <img
                      src={txn.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAACUCAMAAAAEVFNMAAAAMFBMVEXm5uampqajo6PBwcHp6emgoKC3t7fIyMisrKza2trV1dWysrLd3d3Ly8vPz8+pqamC97l5AAADYklEQVR4nO2b0ZKrIAxAFaOiIP7/3150a7duq0VIgszNedp9O5NJQyCxqgRBEARBEARBEARBEA6Ahd0fd8YbDq7pOuPpusYN1b2dh94opeon/h/TD7mtjrCTUe2L7cO5VWayud3eAdto9Wa7xVk39l6ZAVXjvT7rrsp13VT3UYbKze2x7Q/t7O6iDLY7SoZ9YnT3yAsYTIDuqmyGGxiDCwnvFmSX3Rj6r9n7SttnNoYpOLyPIE9ZjcFd013ImRXgLuXDD20+Y7Dhv7dflMpX3ULr2R9jk0kX+ihfb5ynVMAYp7swZjHuIgPsQ9xl0IUxokJstBlCDDret641uzCM0QmxoPhDHJ/BqzB3FsMwp/jW9czdacbW4GeIe17fxIzgzwmbVCMWNO/VP61GrCEeOX0v3jM+wXv3gNQUXpKYVTg5hbkPu+QA+xBz+lbJKeyTmNPXYghz1jUUYc5346E04f8zJVjP5tKqBGDUYd6TLv1oZj3pyuslSuvWiuuHy7txFHenq6bUCE/MwkNiTmjukXliYeMtaqvwkCbMP2KEuHnBw9dkeG4t7X24uBd4XyiiHzDnPFs1pU2RquLmdJ64COfzhWG+HGPF/va+My5sml/evsS1DZqb7NC48Aup0vl9162qwEO6vcVW1UITFGPV5PZ8AqP57mvy7Bx8Aqqx+y7cjTdZZYTKmbNF0WdG1OYe25fT90XRjXbmvnr+xSeDft9xPolyq7MmRuBe6045444rwBSSu2/K9ZRnkd+HN/JW12YJMozxb8RK89dkmK63wi/GNXvTFnYanygzn9OpvtzGDcYUidE4Pb4LbDEGHN/FmOWXhzCQ2WAZzKRs4b5DX4/Bps8Uf1Ga/sxLHynujKnfMaMfAA+NidPY4uoukM7rkuYEnyGdHlx+mAoyJuyDLH6AlxDTJQX2L+5hTLZKbFNa4BPhmSjEiGfyHqoTGhLX3o+ZSYSjvkULg+aLNQh48IuFohYnfwhxBsWgBr2LeIWko8Bt0/4IEzRtlBlBMn12hAH2IXbYvmg3zwNh/Pso5s3og7DG9rWkvt4Yu5/AWCI/A3vBnPBcfggjn86A8Zp2Koz8q0NYGD4He/MO4+Ojc5AXtul64Q3snpjaF30TSISphRU5yMINOcjCgiAIgiAIn/gHGk8rxDA1uuQAAAAASUVORK5CYII="}
                      className="img-fluid m-2 rounded-4"
                      alt="customer"
                    />
                  </div>
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
                            Last updated {new Date(txn.updatedAt).toLocaleString()}
                          </small>
                        </p>
                      </div>
                    </Link>
                  </div>
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
