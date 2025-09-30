import React, { useState, useContext } from "react";
import AppContext from "./context/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
const [loading, setLoading] = useState(false)
const { formData, setFormData, handleCreateProduct } = useContext(AppContext);

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
    console.log(formData)
  }
};

const notifyProductCreation = () => {
      toast.success("Product Created Successfully", {
        position: "top-right",
        autoClose: 3000, // time in ms
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


   

  

  return (
    <div className="container p-4">
      <h1 className="mb-4">Create Product</h1>
      <form onSubmit={async (e)=>{
        e.preventDefault();
         await handleCreateProduct(formData)
         notifyProductCreation()
         }}>
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
  onChange={cloudinaryImgUpload} // call your upload function
/>
          <label className="input-group-text">Product Image</label>
        </div>
        {loading && <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>}
        {formData.productImg  && (
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
        // productType: "",
        deviceType: "others",
        mobileIMEI1: "", // clear IMEIs when selecting others
        mobileIMEI2: "",
      }))
    }
  >
    Others
  </button>
</div>

{/* Show IMEI inputs if Mobile is selected */}
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
          <button type="submit" className="btn btn-outline-success" disabled={loading}>
            Create Product
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default Product;
