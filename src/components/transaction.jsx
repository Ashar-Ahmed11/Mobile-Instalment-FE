import React from 'react'
import { useState } from 'react'
const Transaction = () => {
    const [paymentMethod, setPaymentMethod] = useState("cash")
    const [mobileCost, setMobileCost] = useState(null)
    const [instalments, setInstalments] = useState([])


    const instalmentArray = Array(12).fill()
    const [instalmentDuration, setInstalmentDuration] = useState(12)
    const createInstalment = (value, insDuration) => {
        let newCost = Number(value) / insDuration
        let arr = []
        for (let index = 0; index < insDuration; index++) {
            arr.push(newCost)
        }

        setInstalments(arr)
        setInstalmentDuration(insDuration)
    }

    const [ProductType, setProductType] = useState(null)
    console.log(instalments);
    const [DeviceCash, setdeviceCash] = useState(null)

    return (
        <div>
            <h1 className="px-4">Create Transaction</h1>
            <div className="container-fluid p-4">
                <h3 className='py-4'>User Information</h3>
                <input type="text" placeholder='Full Name' className="my-2 form-control" />
                <input type="tel" placeholder='Contact Number' className="my-2 form-control" />
                <input type="tel" placeholder='CNIC Number' className="my-2 form-control" />
                <input type="text" placeholder='Address' className="my-2 form-control" />

                <div class="input-group mb-3">
                    <input type="file" class="form-control" id="inputGroupFile02" />
                    <label class="input-group-text" for="inputGroupFile02">User Image</label>
                </div>

                <h3 className='py-4'>Granter Information</h3>
                <input type="text" placeholder='Full Name' className="my-2 form-control" />
                <input type="tel" placeholder='Contact Number' className="my-2 form-control" />
                <input type="tel" placeholder='CNIC Number' className="my-2 form-control" />
                <input type="text" placeholder='Address' className="my-2 form-control" />
                <div class="input-group mb-3">
                    <input type="file" class="form-control" id="inputGroupFile02" />
                    <label class="input-group-text" for="inputGroupFile02">Granter Image</label>
                </div>
                <h3 className='py-4'>Product Type</h3>
                <input onChange={({target:{value}})=>{setProductType(value)}} type="text" placeholder='Product Type' className="my-2 form-control" />

                <h3 className='py-4'>{ProductType?ProductType:"Product"} Information</h3>
                <input type="text" placeholder='Product Name' className="my-2 form-control" />
                <input onChange={({ target: { value } }) => { setMobileCost(value); createInstalment(value, 12); if (value == 0) { setInstalments([]) } }} value={mobileCost} type="number" placeholder='Instalment Price' className="my-2 form-control" />
                <input onChange={({target:{value}})=>setdeviceCash(value)} type="number" placeholder='Cash Price' className="my-2 form-control" />

                <h3 className='py-4'>Payment Method</h3>
                <div className="d-flex">
                    <button disabled={mobileCost > 0 ? false : true} onClick={() => {

                        if (paymentMethod !== "instalment") { setPaymentMethod("instalment") }



                    }} className={`btn ${paymentMethod !== "cash" ? "btn-primary" : "btn-outline-primary"} mx-2`}>Instalment</button>
                    <button disabled={DeviceCash > 0 ? false : true} onClick={() => {
                        if (paymentMethod !== "cash") { setPaymentMethod("cash") }


                    }
                    } className={`btn ${paymentMethod == "cash" ? "btn-primary" : "btn-outline-primary"} mx-2`}>Cash</button>
                </div>

                {(paymentMethod == "instalment" && mobileCost>0) && <><h3 className='py-4'>Instalment Duration</h3>

                    <div className='py-4'>
                        {instalmentArray.filter((e, i) => i !== 0).map((e, i) => {
                            return <button onClick={() => { createInstalment(mobileCost, i + 2) }} className={`btn btn-${instalmentDuration == i + 2 ? "primary" : "outline-primary"} m-2`}>1 - {i + 2} Months</button>
                        })}
                    </div></>}


                <div className='py-4'>
                    {(paymentMethod == "instalment" && mobileCost>0)&& instalments.map((e, i) => {
                        return <div className='d-flex align-items-center'><span className='px-2 fw-bold'>{i + 1}</span><input value={e} onChange={({ target: { value } }) => {
                            instalments[i] = value;
                            setInstalments([...instalments])
                        }} type="number" placeholder='Instalment' className="my-2 form-control" />
                        </div>
                    })}
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-success">Create Transaction</button>
                </div>
            </div>
        </div>
    )
}

export default Transaction