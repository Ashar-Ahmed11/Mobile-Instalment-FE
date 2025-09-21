import React from 'react'

const Home = () => {
    return (
        <>
            <div>

                <h1 className="px-4">Admin Dashboard</h1>
                <div className="container-fluid py-5">
                    <div className="row">
                        <div className="col-md-4 col-12 my-2">
                            <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>10</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Total Customers</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>83</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Total Transactions</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>PKR 88,000</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Total Cash</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>PKR 22,000</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Remaining Instalments</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>4</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Instalment Customers</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 my-2">
                            <div className="shadow-sm rounded-4 card text-center p-4">
                                <div>
                                    <h1>4</h1>
                                </div>
                                <div className="card-body">
                                    <h3 className='fw-normal'>Cash Customers</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home