import React, { useState, useContext, useEffect } from 'react';
import AppContext from "./context/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transaction = () => {
  const { products, createTransaction } = useContext(AppContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mobileCost, setMobileCost] = useState(null);
  const [instalments, setInstalments] = useState([]);
  const [instalmentDuration, setInstalmentDuration] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [ProductType, setProductType] = useState(null);
  const [ProductName, setProductName] = useState(null);
  const [DeviceCash, setDeviceCash] = useState(null);
  const [advanceInstalment, setAdvanceInstalment] = useState(null);


  const [loading, setLoading] = useState(false);

  // User Info
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    contactNumber: '',
    cnicNumber: '',
    address: '',
    image: null
  });

  // Granter Info
  const [granterInfo, setGranterInfo] = useState({
    fullName: '',
    contactNumber: '',
    cnicNumber: '',
    address: '',
    image: null
  });

  const instalmentArray = Array(12).fill();

  const createInstalment = (value, insDuration) => {
    let subCost = Number(value)- advanceInstalment
    let newCost = subCost / insDuration;
    let arr = [];
    for (let index = 0; index < insDuration; index++) {
      arr.push(newCost);
    }
    setInstalments(arr);
    setInstalmentDuration(insDuration);
  };
const handleSearch = (query) => {
  setSearchQuery(query);

  if (!query.trim()) {
    // If input is empty or only spaces, hide all results
    setFilteredProducts([]);
    return;
  }

  // Filter products based on query
  const filtered = products.filter(product =>
    product.productName.toLowerCase().includes(query.toLowerCase()) ||
    product.wholesalerName.toLowerCase().includes(query.toLowerCase()) ||
    product.productType.toLowerCase().includes(query.toLowerCase())
  );

  // Show only first 3 matches
  setFilteredProducts(filtered.slice(0, 3));
};
useEffect(() => {
  if (mobileCost > 0 && advanceInstalment !== null) {
    createInstalment(mobileCost, instalmentDuration);
  }
}, [advanceInstalment, mobileCost, instalmentDuration]);



//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     const filtered = products.filter(product =>
//       product.productName.toLowerCase().includes(query.toLowerCase()) ||
//       product.wholesalerName.toLowerCase().includes(query.toLowerCase()) ||
//       product.productType.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredProducts(filtered);
//   };

  // Cloudinary upload (shared for user + granter)
  const cloudinaryImgUpload = async (file, setter, fieldName) => {
    if (!file) return;
    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "for_mobile"); // your unsigned preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dqu8eh3hz/image/upload`,
        { method: "POST", body: data }
      );

      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setter(prev => ({
          ...prev,
          [fieldName]: uploaded.secure_url,
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

  const handleUserChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      cloudinaryImgUpload(files[0], setUserInfo, "image");
    } else {
      setUserInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


    const notifyTrasactionCreation = () => {
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

  const handleGranterChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      cloudinaryImgUpload(files[0], setGranterInfo, "image");
    } else {
      setGranterInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateTransaction = async () => {
    setLoading(true);
    const transactionObject = {
      ...userInfo,
      granterFullName: granterInfo.fullName,
      granterContactNumber: granterInfo.contactNumber,
      granterCnicNumber: granterInfo.cnicNumber,
      granterAddress: granterInfo.address,
      granterImage: granterInfo.image,
      productType: ProductType,
      transactionType: paymentMethod,
      advanceInstalment: advanceInstalment,
      installments: paymentMethod === "instalments" ? instalments : [],
      cashPrice: DeviceCash,
      installmentPrice: mobileCost,
      date: new Date()
    };

    console.log("Transaction Object:", transactionObject);

    await createTransaction(transactionObject);
    notifyTrasactionCreation()
    setLoading(false);
  };

  
  

  return (
    <div>
      <h1 className="px-4">Create Transaction</h1>
      <div className="container-fluid p-4">
        <h3 className='py-4'>User Information</h3>
        <input name="fullName" value={userInfo.fullName} onChange={handleUserChange} type="text" placeholder='Full Name' className="my-2 form-control" />
        <input name="contactNumber" value={userInfo.contactNumber} onChange={handleUserChange} type="tel" placeholder='Contact Number' className="my-2 form-control" />
        <input name="cnicNumber" value={userInfo.cnicNumber} onChange={handleUserChange} type="tel" placeholder='CNIC Number' className="my-2 form-control" />
        <input name="address" value={userInfo.address} onChange={handleUserChange} type="text" placeholder='Address' className="my-2 form-control" />
        <div className="input-group mb-3">
          <input name="image" onChange={handleUserChange} type="file" className="form-control" />
          <label className="input-group-text">User Image</label>
        </div>
          {loading && <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>}
        {userInfo.image && (
          <img src={userInfo.image} alt="User" style={{ maxWidth: "150px", borderRadius: "8px" }} />
        )}

        <h3 className='py-4'>Guarantor Information</h3>
        <input name="fullName" value={granterInfo.fullName} onChange={handleGranterChange} type="text" placeholder='Full Name' className="my-2 form-control" />
        <input name="contactNumber" value={granterInfo.contactNumber} onChange={handleGranterChange} type="tel" placeholder='Contact Number' className="my-2 form-control" />
        <input name="cnicNumber" value={granterInfo.cnicNumber} onChange={handleGranterChange} type="tel" placeholder='CNIC Number' className="my-2 form-control" />
        <input name="address" value={granterInfo.address} onChange={handleGranterChange} type="text" placeholder='Address' className="my-2 form-control" />
        <div className="input-group mb-3">
          <input name="image" onChange={handleGranterChange} type="file" className="form-control" />
          <label className="input-group-text">Guarantor Image</label>
        </div>
          {loading && <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>}
        {granterInfo.image && (
          <img src={granterInfo.image} alt="Granter" style={{ maxWidth: "150px", borderRadius: "8px" }} />
        )}


        <h3 className='py-4'>Product Type</h3>
       <input 
  type="text" 
  placeholder="Search products..." 
  value={searchQuery} 
  onChange={(e) => handleSearch(e.target.value)}
  className="form-control my-2"
/>

{/* Only show list if there is a search query and results */}
{searchQuery.trim() && filteredProducts.length > 0 && (
  <ul className="list-group my-2">
    {filteredProducts.map(product => (
      <li 
        key={product._id} 
        className={`list-group-item ${ProductType === product._id ? 'active' : ''}`}
        onClick={() => {setProductType(product._id); setProductName(product.productName)}}
        style={{ cursor: "pointer" }}
      >
        {product.productName} - {product.wholesalerName} ({product.productType})
      </li>
    ))}
  </ul>
)}


        <h3 className='py-4'>{ProductName ? ProductName : "Product"} Information</h3>
        <input onChange={({ target: { value } }) => { setMobileCost(value); createInstalment(value, 12); if (value == 0) { setInstalments([]) } }} value={mobileCost} type="number" placeholder='Instalments Price' className="my-2 form-control" />
        <input onChange={({ target: { value } }) => setDeviceCash(value)} type="number" placeholder='Cash Price' className="my-2 form-control" />

        <h3 className='py-4'>Payment Method</h3>
        <div className="d-flex">
          <button 
            disabled={mobileCost <= 0 || loading} 
            onClick={() => setPaymentMethod("instalments")} 
            className={`btn ${paymentMethod === "instalments" ? "btn-primary" : "btn-outline-primary"} mx-2`}
          >
            Instalments
          </button>
          <button 
            disabled={DeviceCash <= 0 || loading} 
            onClick={() => setPaymentMethod("cash")} 
            className={`btn ${paymentMethod === "cash" ? "btn-primary" : "btn-outline-primary"} mx-2`}
          >
            Cash
          </button>
        </div>
        {(paymentMethod === "instalments" && mobileCost > 0) &&
        <>
<h3 className='py-4'>Advance Instalments</h3>

<input
  onChange={({ target: { value } }) => {
    setAdvanceInstalment(Number(value));
    if (mobileCost > 0) {
      createInstalment(mobileCost, instalmentDuration);
    }
  }}
  type="number"
  placeholder="Advance Inputs"
  className="my-2 form-control"
/>

        </>
}
        {(paymentMethod === "instalments" && mobileCost > 0) &&
          <>
            <h3 className='py-4'>Instalments Duration</h3>
            <div className='py-4'>
              {instalmentArray.filter((e, i) => i !== 0).map((e, i) => (
                <button 
                  key={i} 
                  onClick={() => { createInstalment(mobileCost, i + 2) }} 
                  className={`btn btn-${instalmentDuration === i + 2 ? "primary" : "outline-primary"} m-2`}
                >
                  1 - {i + 2} Months
                </button>
              ))}
            </div>
          </>
        }

        <div className='py-4'>
          {(paymentMethod === "instalments" && mobileCost > 0) && instalments.map((e, i) => (
            <div key={i} className='d-flex align-items-center'>
              <span className='px-2 fw-bold'>{i + 1}</span>
              <input value={e} onChange={({ target: { value } }) => { instalments[i] = Number(value); setInstalments([...instalments]) }} type="number" placeholder='Instalments' className="my-2 form-control" />
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end">
          <button 
            onClick={handleCreateTransaction} 
            className="btn btn-outline-success"
            disabled={loading}
          >
            {loading ? (
              <span 
                className="spinner-border spinner-border-sm me-2" 
                role="status" 
                aria-hidden="true"
              ></span>
            ) : "Create Transaction"}
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  )
};

export default Transaction;
