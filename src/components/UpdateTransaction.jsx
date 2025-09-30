import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppContext from "./context/appContext";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const UpdateTransaction = () => {
  const { id } = useParams(); // ✅ get transaction id from URL
  const history = useHistory()
  const { products, deleteTransaction, getTransactionById, updateTransaction } = useContext(AppContext);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mobileCost, setMobileCost] = useState(null);
  const [modal, setModal] = useState(false)
  const [instalments, setInstalments] = useState([]);
  const [instalmentDuration, setInstalmentDuration] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [ProductType, setProductType] = useState({});
  const [ProductName, setProductName] = useState(null);
  const [DeviceCash, setDeviceCash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [advanceInstalment, setAdvanceInstalment] = useState(null);

  // User Info
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    contactNumber: "",
    cnicNumber: "",
    address: "",
    image: null,
  });

  // Granter Info
  const [granterInfo, setGranterInfo] = useState({
    fullName: "",
    contactNumber: "",
    cnicNumber: "",
    address: "",
    image: null,
  });

  const instalmentArray = Array(12).fill();

  // ✅ fetch transaction details on mount
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const txn = await getTransactionById(id);
        setAdvanceInstalment(txn.advanceInstalment)
        console.log("Transaction fetched:", txn);

        if (txn) {
          // Prefill user info
          setUserInfo({
            fullName: txn.fullName || "",
            contactNumber: txn.contactNumber || "",
            cnicNumber: txn.cnicNumber || "",
            address: txn.address || "",
            image: txn.image || null,
          });

          // Prefill granter info
          setGranterInfo({
            fullName: txn.granterFullName || "",
            contactNumber: txn.granterContactNumber || "",
            cnicNumber: txn.granterCnicNumber || "",
            address: txn.granterAddress || "",
            image: txn.granterImage || null,
          });

          // Prefill product & payment info
          setProductType(txn.productType);
          setPaymentMethod(txn.transactionType || "cash");
          setInstalments(txn.installments || []);
          setDeviceCash(txn.cashPrice || null);
          setMobileCost(txn.installmentPrice || null);
          setInstalmentDuration(txn.installments?.length || 12);
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Create instalments dynamically
  const createInstalment = (value, insDuration) => {
    let subCost = Number(value) - advanceInstalment
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
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(query.toLowerCase()) ||
        product.wholesalerName.toLowerCase().includes(query.toLowerCase()) ||
        product.productType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };


  // Cloudinary upload (user + granter)
  const cloudinaryImgUpload = async (file, setter, fieldName) => {
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
        setter((prev) => ({
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
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    if (mobileCost > 0 && advanceInstalment !== null) {
      createInstalment(mobileCost, instalmentDuration);
    }
  }, [advanceInstalment, mobileCost, instalmentDuration]);

  const handleGranterChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      cloudinaryImgUpload(files[0], setGranterInfo, "image");
    } else {
      setGranterInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const transactionObject = {
      ...userInfo,
      granterFullName: granterInfo.fullName,
      granterContactNumber: granterInfo.contactNumber,
      granterCnicNumber: granterInfo.cnicNumber,
      granterAddress: granterInfo.address,
      granterImage: granterInfo.image,
      productType: ProductType,
      advanceInstalment: advanceInstalment,
      transactionType: paymentMethod,
      installments: paymentMethod === "instalments" ? instalments : [],
      cashPrice: DeviceCash,
      installmentPrice: mobileCost,
      date: new Date(),
    };

    console.log("Transaction Object:", transactionObject);

    //  createTransaction(transactionObject);
    await updateTransaction(id, transactionObject)
    setLoading(false);
  };

  //     const handleUpdate = ()=>{
  //   }


  return (
    <div>
      <h1 className="px-4">Update Transaction</h1>

      {loading ? <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div> :
        <>
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
            {granterInfo.image && (
              <img src={granterInfo.image} alt="Granter" style={{ maxWidth: "150px", borderRadius: "8px" }} />
            )}

            <h3 className='py-4'>Product Type</h3>
            {/* Optional search box – uncomment if you still want search */}

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control my-2"
            />


            <ul className="list-group my-2">

              <li

                className={`list-group-item ${'active'}`}
                onClick={() => {
                  setProductType(ProductType._id);
                  setProductName(ProductType.productName);
                }}
                style={{ cursor: "pointer" }}
              >
                {ProductType.productName} - {ProductType.wholesalerName} ({ProductType.productType})
              </li>

            </ul>


            <h3 className='py-4'>{ProductName ? ProductName : "Product"} Information</h3>
            <input
              onChange={({ target: { value } }) => {
                setMobileCost(value);
                createInstalment(value, 12);
                if (value == 0) setInstalments([]);
              }}
              value={mobileCost || ""}
              type="number"
              placeholder="Instalment Price"
              className="my-2 form-control"
            />

            <input
              onChange={({ target: { value } }) => setDeviceCash(value)}
              value={DeviceCash || ""}
              type="number"
              placeholder="Cash Price"
              className="my-2 form-control"
            />


            <h3 className='py-4'>Payment Method</h3>
            <div className="d-flex">
              <button
                disabled={mobileCost <= 0 || loading}
                onClick={() => setPaymentMethod("instalments")}
                className={`btn ${paymentMethod === "instalments" ? "btn-primary" : "btn-outline-primary"} mx-2`}
              >
                Instalment
              </button>
              <button
                disabled={DeviceCash <= 0 || loading}
                onClick={() => setPaymentMethod("cash")}
                className={`btn ${paymentMethod === "cash" ? "btn-primary" : "btn-outline-primary"} mx-2`}
              >
                Cash
              </button>
            </div>
            {paymentMethod === "instalments" && <input
              onChange={({ target: { value } }) => {
                setAdvanceInstalment(Number(value));

                if (mobileCost > 0) {
                  createInstalment(mobileCost, instalmentDuration);
                }
              }}
              value={advanceInstalment || ""}
              type="number"
              placeholder="Advance Inputs"
              className="my-2 form-control"
            />}

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
                  <input value={e} onChange={({ target: { value } }) => { instalments[i] = Number(value); setInstalments([...instalments]) }} type="number" placeholder='Instalment' className="my-2 form-control" />
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-primary"
                disabled={loading}
                onClick={() => {
                  setModal(true);
                  history.push(`/pdf/${id}`);
                }}
              >
                Create Quotation
              </button>

              <button
                type="button"
                className="btn btn-outline-danger mx-2"
                disabled={loading}
                onClick={() => setModal(true)}
              >
                Delete Transaction
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-outline-success"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : "Update Transaction"}
              </button>
            </div>
          </div>
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
                        await deleteTransaction(id)
                        history.push("/dashboard/users")
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
        </>
      }
    </div>
  )
};

export default UpdateTransaction;
