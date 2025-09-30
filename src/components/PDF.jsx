import { useContext, useEffect } from 'react';
import AppContext from './context/appContext';
import { Resolution } from 'react-to-pdf';
import { useParams } from "react-router-dom";
import { usePDF } from 'react-to-pdf';
import { Helmet } from 'react-helmet-async';

function Pdf() {
  const context = useContext(AppContext);
  const { pdfData, getTransactionById } = context;
  const { id } = useParams();

  const { toPDF, targetRef } = usePDF({
    filename: pdfData?.pdfName || "Transaction",
    resolution: Resolution.HIGH
  });

  useEffect(() => {
    const fetchFunc = async () => {
      await getTransactionById(id)
      console.log(pdfData, "qew")
    }
    fetchFunc()
  }, [id])

  const formatCurrency = (value) => {
    return value ? value.toLocaleString("en") : "0";
  };

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=1024" />
      </Helmet>

      <div className="container text-center">
        <button
          className="btn btn-outline-primary my-4"
          onClick={() => toPDF()}
        >
          Download PDF
        </button>
      </div>

      <div
        ref={targetRef}
        style={{
          maxWidth: "793px",
          minHeight: "1122px",
          margin: "0 auto",
          background: "#fff",
          color: "#000",
          padding: "20px"
        }}
        className="shadow-lg rounded"
      >
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="fw-bold h3 pt-3">Kamran Mobile Zone & Electronics</h1>
          <p>شاپ نمبر 39، فرسٹ فلور المسلم پلازہ,<br />ترانفارمر چوک، صادق آباد، راولپنڈی</p>
          <p className="pt-1">Ph: 0312-9071455, 0330-6033470</p>
          {/* <p className="opacity-75">{pdfData?._id}</p> */}
        </div>
        <div className="d-flex justify-content-end px-2">
          <p className="mb-1">
            <strong>Date:</strong>{" "}
            {pdfData?.date ? new Date(pdfData.date).toLocaleDateString() : ""}
          </p>
        </div>

        {/* User & Granter Info */}
        <div className="row mb-4 g-3">
          <div className="col-12 col-md-6 border p-3 rounded-3" style={pdfData.transactionType === "cash" ? { width: "100%" } : {}}>
            <h5 className="fw-bold">User Details</h5>
            <p><strong>Name:</strong> {pdfData?.fullName}</p>
            <p><strong>Phone:</strong> {pdfData?.contactNumber}</p>
            {pdfData.transactionType === "instalments" && <p><strong>CNIC:</strong> {pdfData?.cnicNumber}</p>}
            <p><strong>Address:</strong> {pdfData?.address}</p>
          </div>

          {pdfData.transactionType === "instalments" && (<div className="col-12 col-md-6 border p-3 rounded-3">
            <h5 className="fw-bold">Guarantor Details</h5>
            <p><strong>Name:</strong> {pdfData?.granterFullName}</p>
            <p><strong>Phone:</strong> {pdfData?.granterContactNumber}</p>
            {pdfData.transactionType === "instalments" && <p><strong>CNIC:</strong> {pdfData?.granterCnicNumber}</p>}
            <p><strong>Address:</strong> {pdfData?.granterAddress}</p>
          </div>)}
        </div>
        <div className="pt-5 pb-2">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">Product</th>
                {/* <th scope="col">Wholesaler</th> */}
                <th scope="col">Type</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {pdfData?.productType ? (
                <tr>
                  <td>{pdfData.productType.productName}</td>
                  {/* <td>{pdfData.productType.wholesalerName}</td> */}
                  <td>{pdfData.productType.productType}</td>
                  <td>
                    {pdfData.transactionType === "cash"
                      ? `${pdfData.cashPrice} PKR`
                      : `${pdfData.installmentPrice} PKR `}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No product information available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pdfData?.productType?.productType == "mobile" && <div className="py-3">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">IMEI Number 1</th>
                {/* <th scope="col">Wholesaler</th> */}
                <th scope="col">IMEI Number 2</th>
                {/* <th scope="col">Amount</th> */}
              </tr>
            </thead>
            <tbody>

              <tr>
                <td>{pdfData.productType.mobileIMEI1}</td>
                {/* <td>{pdfData.productType.wholesalerName}</td> */}
                <td>{pdfData.productType.mobileIMEI2}</td>
                {/* <td>
            {pdfData.transactionType === "cash"
              ? `${pdfData.cashPrice} PKR`
              : `${pdfData.installmentPrice} PKR `}
          </td> */}
              </tr>



            </tbody>
          </table>
        </div>}

        {pdfData.transactionType === "instalments" && <div className="row">
          <div className="col-6"></div>
          <div className="col-6 p-1">
            <div className='h-100 p-3 border border-dark rounded-4 flex-column d-flex justify-content-center'>
              <div className="d-flex justify-content-between align-items-center">
                <span className=" fw-bold">Total</span>
                <span className=" ">{pdfData?.cashPrice ? pdfData.cashPrice.toLocaleString("en") : pdfData?.installmentPrice?.toLocaleString("en")} PKR</span>
              </div>
              {pdfData.transactionType === "instalments" && (<div className="d-flex justify-content-between">
                <span className=" fw-bold">Remaining Instalment</span>
                <span className=" opacity-75">{(pdfData?.installmentPrice - pdfData?.advanceInstalment).toLocaleString("en")} PKR</span>
              </div>)}
              <div className="d-flex justify-content-between">
                <span className=" fw-bold">{pdfData?.cashPrice ? "Sub Total" : "Instalment Advance"}</span>
                <span className=" opacity-75">{pdfData?.cashPrice ? pdfData.cashPrice.toLocaleString("en") : pdfData?.advanceInstalment?.toLocaleString("en")} PKR</span>
              </div>
            </div>
          </div>
        </div>}
        {pdfData.transactionType === "cash" && <div className="row">
          <div className="col-6"></div>
          <div className="col-6 p-1">
            <div className='h-100 p-3 border border-dark rounded-4 flex-column d-flex justify-content-center'>
              <div className="d-flex justify-content-between">
                <span className=" fw-bold">{pdfData?.cashPrice ? "Sub Total" : "Instalment Advance"}</span>
                <span className=" opacity-75">{pdfData?.cashPrice ? pdfData.cashPrice.toLocaleString("en") : pdfData?.advanceInstalment?.toLocaleString("en")} PKR</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className=" fw-bold">Total</span>
                <span className=" fw-bold h3">{pdfData?.cashPrice ? pdfData.cashPrice.toLocaleString("en") : pdfData?.installmentPrice?.toLocaleString("en")} PKR</span>
              </div>
              {pdfData.transactionType === "instalments" && (<div className="d-flex justify-content-between">
                <span className=" fw-bold">Remaining Instalment</span>
                <span className=" opacity-75">{(pdfData?.installmentPrice - pdfData?.advanceInstalment).toLocaleString("en")} PKR</span>
              </div>)}

            </div>
          </div>
        </div>}

        {/* Notes */}
        <div>
          <h5 className="fw-bold mb-2">Notes</h5>
          <p className="opacity-75">
            1. Kamran Mobile Zone & Electronics is not responsible for any warranty.
          </p>
          <p className="opacity-75">
            2. For warranty claim please contact to the related claim.
          </p>
          <p className="opacity-75">
            3. Goods once sold can not be taken.
          </p>

        </div>
      </div>
    </>
  );
}

export default Pdf;
