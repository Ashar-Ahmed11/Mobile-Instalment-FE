import React, { useState, useContext, useEffect } from "react";
import AppContext from "./context/appContext";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const UpdateProducts = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory()
  const { product, fetchProduct, updateProduct,deleteProduct, notify, setNotify } = useContext(AppContext);
  const { id } = useParams(); // ✅ match route param name
  const [modal, setModal] = useState(false)

  const [formData, setFormData] = useState({
    wholesalerName: "",
    productName: "",
    productDescription: "",
    productType: "",
    productImg: "",
    mobileIMEI1: "",
    mobileIMEI2: "",
    wholesalePrice: "",
  });

   const notifyUpdateProduct = () => {
      toast.success("Update Complete", {
        position: "top-right",
        autoClose: 3000, // time in ms
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
    
   
   
//   useEffect(() => {
  
//       console.log(formData)
//   }, [formData])
  

  // Fetch product by id and set initial form data
  useEffect(() => {
    const loadProduct = async () => {
      const fetched = await fetchProduct(id);
      if (fetched) {
        setFormData(fetched); // ✅ prefill form with backend data
      }
    };
    loadProduct();
  }, [id]);

  // Upload to Cloudinary
  const cloudinaryImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "for_mobile");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dqu8eh3hz/image/upload`,
        { method: "POST", body: data }
      );

      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setFormData((prev) => ({
          ...prev,
          productImg: uploaded.secure_url,
        }));
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Cloudinary error:", err);
      alert("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, formData); // ✅ update instead of create
    notifyUpdateProduct()
  };

  return (
    <div className="container p-4">
      <h1 className="mb-4">Update Product</h1>
      <form onSubmit={handleSubmit}>
        <h3 className="py-3">Wholesaler Information</h3>
        <input
          type="text"
          name="wholesalerName"
          placeholder="Wholesaler Name"
          className="my-2 form-control"
          value={formData.wholesalerName}
          onChange={handleChange}
          required
        />

        <h3 className="py-3">Product Information</h3>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          className="my-2 form-control"
          value={formData.productName}
          onChange={handleChange}
          required
        />
        <textarea
          name="productDescription"
          placeholder="Product Description"
          className="my-2 form-control"
          value={formData.productDescription}
          onChange={handleChange}
          required
        />
        {/* <input
          type="text"
          name="productType"
          placeholder="Product Type"
          className="my-2 form-control"
          value={formData.productType}
          onChange={handleChange}
          required
        /> */}

        <div className="input-group my-3">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={cloudinaryImgUpload}
          />
          <label className="input-group-text">Product Image</label>
        </div>
        {loading && (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        )}
        {formData.productImg && (
          <div className="mt-3">
            <img
              src={formData.productImg}
              alt="Product Preview"
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          </div>
        )}

        <h3 className="py-3">Device Information</h3>

<div className="mb-3 d-flex gap-2">
  <button
    type="button"
    className={`btn ${formData.productType === "mobile" ? "btn-primary" : "btn-outline-primary"}`}
    onClick={() =>
      setFormData((prev) => ({
        ...prev,

        
        productType: "mobile",
        deviceType:''
         // clear productType when selecting mobile
      }))
    }
  >
    Mobile
  </button>

  <button
    type="button"
    className={`btn ${formData.deviceType === "others" ? "btn-primary" : "btn-outline-primary"}`}
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
       deviceType: "others",
        productType: "", // allow user to enter
        
      }))
    }
  >
    Others
  </button>
</div>

{/* Show IMEI inputs if Mobile is selected */}
{formData.productType === "mobile" && (
  <>
    <input
      type="text"
      name="mobileIMEI1"
      placeholder="Mobile IMEI 1"
      className="my-2 form-control"
      value={formData.mobileIMEI1}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="mobileIMEI2"
      placeholder="Mobile IMEI 2"
      className="my-2 form-control"
      value={formData.mobileIMEI2}
      onChange={handleChange}
      required
    />
  </>
)}

{/* Show Product Type input if Others is selected */}
{formData.deviceType === "others" && (
  <input
    type="text"
    name="productType"
    placeholder="Product Type"
    className="my-2 form-control"
    value={formData.productType}
    onChange={handleChange}
    required
  />
)}
<input
  type="number"
  name="wholesalePrice"
  placeholder="Wholesale Price"
  className="my-2 form-control"
  value={formData.wholesalePrice}
  onChange={handleChange}
  required
/>


        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            disabled={loading}
              onClick={() => setModal(true)}
          >
            Delete Product
          </button>
          <button
            type="submit"
            className="btn btn-outline-success mx-2"
            disabled={loading}
          >
            Update Product
          </button>
        </div>
      </form>
      <ToastContainer/>
      {modal && (
  <div
    className="modal fade show"
    tabIndex="-1"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Delete</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setModal(false)}
          />
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this product?</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={async () => {
                setModal(false);
             await deleteProduct(id)
              history.push("/dashboard/view-products/all")
            //   setNotify(true)
              
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default UpdateProducts;
