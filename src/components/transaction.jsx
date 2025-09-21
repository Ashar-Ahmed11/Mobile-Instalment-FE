import React from 'react'
import { useState } from 'react'
const Transaction = () => {
    const [paymentMethod, setPaymentMethod] = useState("cash")
    const [mobileCost, setMobileCost] = useState(null)
    const [instalments, setInstalments] = useState([])
    const createInstalment = (value) => {
        let newCost = Number(value) / 12
        let arr = []
        for (let index = 0; index < 12; index++) {
            arr.push(newCost)
        }

        setInstalments(arr)
    }

    console.log(instalments);


    return (
        <div>
            <h1 className="px-4">Create Transaction</h1>
            <div className="container-fluid p-4">
                <h3 className='py-4'>User Information</h3>
                <input type="text" placeholder='Full Name' className="my-2 form-control" />
                <input type="tel" placeholder='Contact Number' className="my-2 form-control" />

                <div class="input-group mb-3">
                    <input type="file" class="form-control" id="inputGroupFile02" />
                    <label class="input-group-text" for="inputGroupFile02">User Image</label>
                </div>

                <h3 className='py-4'>Granter Information</h3>
                <input type="text" placeholder='Full Name' className="my-2 form-control" />
                <input type="tel" placeholder='Contact Number' className="my-2 form-control" />

                <div class="input-group mb-3">
                    <input type="file" class="form-control" id="inputGroupFile02" />
                    <label class="input-group-text" for="inputGroupFile02">Granter Image</label>
                </div>

                <h3 className='py-4'>Mobile Information</h3>
                <input type="text" placeholder='Device Name' className="my-2 form-control" />
                <input onChange={({ target: { value } }) => {setMobileCost(value);createInstalment(value);if(value==0){setInstalments([])}}} value={mobileCost} type="number" placeholder='Device Price' className="my-2 form-control" />

                <h3 className='py-4'>Payment Method</h3>
                <div className="d-flex">
                    <button disabled={mobileCost > 0 ? false : true} onClick={() => {

                        if (paymentMethod !== "instalment") { setPaymentMethod("instalment") }
                       


                    }} className={`btn ${paymentMethod !== "cash" ? "btn-primary" : "btn-outline-primary"} mx-2`}>Instalment</button>
                    <button disabled={mobileCost > 0 ? false : true} onClick={() => {
                        if (paymentMethod !== "cash") { setPaymentMethod("cash") }
                        

                    }
                    } className={`btn ${paymentMethod == "cash" ? "btn-primary" : "btn-outline-primary"} mx-2`}>Cash</button>
                </div>

                <div className='py-4'>
                    {paymentMethod=="instalment"&&instalments.map((e,i)=>{
                        return   <input value={e} onChange={({target:{value}})=>{
                            instalments[i]=value;
                            setInstalments([...instalments])
                        }} type="number" placeholder='Instalment' className="my-2 form-control" />
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