import React, { useState, useContext, useEffect } from "react";
import AppContext from "./context/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Product = () => {
  const [loading, setLoading] = useState(false);
  const { handleCreateProduct } = useContext(AppContext);
  const [startDate, setStartDate] = useState(new Date());

  const [formData, setFormData] = useState({
    wholesalerName: "",
    productName: "",
    productDescription: "",
    productType: "",
    productImg: "",
    deviceType:"others",
    mobileIMEI1: "",
    mobileIMEI2: "",
    wholesalePrice: "",
    date: new Date().toISOString() // ✅ Initial date
  });

  // ✅ CRITICAL FIX: Sync formData.date whenever startDate changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: startDate.toISOString()
    }));
    console.log("📅 Date updated:", startDate.toISOString());
  }, [startDate]);

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
        console.error("Upload failed:", uploaded);
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Cloudinary error:", err);
      alert("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  const notifyProductCreation = () => {
    toast.success("Product Created Successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📦 Submitting formData:", formData); // Debug log
    await handleCreateProduct(formData);
    notifyProductCreation();
    
    // ✅ Reset form including date
    setFormData({
      wholesalerName: "",
      productName: "",
      productDescription: "",
      productType: "",
      productImg: "",
      mobileIMEI1: "",
      mobileIMEI2: "",
      wholesalePrice: "",
      date: new Date().toISOString()
    });
    setStartDate(new Date()); // Reset date picker
  };

  return (
    <div className="container p-4">
      <h1 className="mb-4">Create Product</h1>
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
            className={`btn ${formData.deviceType === "mobile" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                deviceType: "mobile",
                productType: "mobile",
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
                mobileIMEI1: "",
                mobileIMEI2: "",
              }))
            }
          >
            Others
          </button>
        </div>

        {formData.deviceType === "mobile" && (
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

        <div className="my-3">
          <h4>Date</h4>
          <DatePicker 
            className='form-control' 
            selected={startDate} 
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
          />
          <small className="text-muted d-block mt-1">
            Selected: {startDate.toLocaleDateString()}
          </small>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-outline-success" disabled={loading}>
            Create Product
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Product;