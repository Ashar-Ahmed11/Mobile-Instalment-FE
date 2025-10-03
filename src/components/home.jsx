import React, { useContext } from 'react'
import AppContext from './context/appContext'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { useState, useEffect } from 'react'
const Home = () => {
    const { getTransactions } = useContext(AppContext)
    const [transactions, settransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const fetchTransactions = async () => {
        let fetchedTransactions = await getTransactions()
        settransactions(fetchedTransactions)
        setLoading(false)
    }
    useEffect(() => {
        fetchTransactions()

    }, [])

    const totalCash = () => {
        let cashTransactions = transactions.filter((e) => { return e.transactionType == "cash" })
        let sumWithInitial = cashTransactions.reduce(
            (accumulator, currentValue) => accumulator + currentValue.cashPrice,
            0,
        );
        return sumWithInitial
    }
    const remainingInstalments = () => {
        let cashTransactions = transactions.filter(
            (e) => e.transactionType !== "cash"
        );

        let sumWithInitial = cashTransactions.reduce((accumulator, txn) => {
            return (
                accumulator +
                txn.installments.reduce(
                    (sum, inst) =>
                        inst.status === "Pending" ? sum + (Number(inst.amount) || 0) : sum,
                    0
                )
            );
        }, 0);

        return sumWithInitial;
    };



    const cashTransactions = () => {
        let cashTransactions = transactions.filter((e) => { return e.transactionType == "cash" })
        return cashTransactions.length
    }

    const instalmentTransactions = () => {
        let cashTransactions = transactions.filter((e) => { return e.transactionType !== "cash" })
        return cashTransactions.length
    }

    console.log(transactions);

    return (
        <>
            <h1 className="px-4">Admin Dashboard</h1>

            {loading ? <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> : <div>

                <div className="container-fluid py-5">
                    <div className="row">
                        <div className="col-md-4 col-12 my-2">
                            <Link style={{ textDecoration: "none" }} to="/dashboard/users/all"> <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>{transactions.length}</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Total Customers</h3>
                                </div>
                            </div>
                            </Link>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <Link style={{ textDecoration: "none" }} to="/dashboard/users/all"> <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>{transactions.length}</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Total Transactions</h3>
                                </div>
                            </div>
                            </Link>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <Link style={{ textDecoration: "none" }} to="/dashboard/users/cash">  <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>{totalCash().toLocaleString("en-US", {
                                        style: "currency", currency: "PKR", minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })}</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Total Cash</h3>
                                </div>
                            </div>
                            </Link>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <Link style={{ textDecoration: "none" }} to="/dashboard/users/instalments/pending">   <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>{remainingInstalments().toLocaleString("en-US", {
                                        style: "currency", currency: "PKR", minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })}</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Remaining Instalments</h3>
                                </div>
                            </div>
                            </Link>

                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <Link style={{ textDecoration: "none" }} to="/dashboard/users/instalments/all">  <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>{instalmentTransactions()}</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Instalments Customers</h3>
                                </div>
                            </div>
                            </Link>

                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <Link style={{ textDecoration: "none" }} to="/dashboard/users/cash">
                                <div className="shadow-sm rounded-4 card text-center p-4">
                                    <div>
                                        <h1>{cashTransactions()}</h1>
                                    </div>
                                    <div className="card-body">
                                        <h3 className='fw-normal'>Cash Customers</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

            </div >}

        </>
    )
}

export default Home