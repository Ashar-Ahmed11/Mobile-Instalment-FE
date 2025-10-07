import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppContext from "./context/appContext";

const ViewProducts = () => {
  const { getProducts, fetchSoldProducts } = useContext(AppContext);
  const { filter: routeFilter } = useParams(); // ✅ capture filter from route
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(routeFilter || "all");

  const fallbackImg =
    "data:image/png;base64,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";

  const fetchData = async () => {
    setLoading(true);
    const data = filter === "sold" ? await fetchSoldProducts() : await getProducts();
    console.log(data)
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div className="container p-4">
      <h1>{filter === "sold" ? "Sold Products" : "All Products"}</h1>
      <div className="d-flex justify-content-center align-items-center my-3">

        {/* ✅ Buttons like Users page */}
        <div>
          <Link to="/dashboard/view-products/all">
            <button
              className={`btn mx-2 ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("all")}
            >
              All Products
            </button>
          </Link>

          <Link to="/dashboard/view-products/sold">
            <button
              className={`btn mx-2 ${filter === "sold" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setFilter("sold")}
            >
              Sold Products
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.slice().reverse().map((product, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <Link
                  to={`/dashboard/update-products/${product._id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.productImg || fallbackImg}
                      className="card-img-top"
                      alt={product.productName || "Product"}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text text-muted">
                        {product.productDescription || "No description available"}
                      </p>
                      {product.sold && <span className="badge bg-success">Sold</span>}
                    </div>
                    <p className="card-text m-2">
                      <small className="text-body-secondary">
                        Date {new Date(product.date).toLocaleDateString("en-GB")}
                      </small>
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-muted text-center">No products available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
