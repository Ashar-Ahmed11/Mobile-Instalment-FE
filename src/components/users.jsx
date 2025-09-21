import React from 'react'
import { useState } from 'react'
const Users = () => {


    return (
        <div>
            <h1 className="px-4">Users</h1>
            <div className="container-fluid p-4">
                <div class="card mb-3 rounded-4 shadow-sm position-relative" >
                    <span class="position-absolute top-0 p-3 start-0 translate-middle badge border border-light rounded-circle bg-primary">
                        <span class="visually-hidden">New alerts</span>

                    </span>
                    <div class="row g-0">
                        <div class="col-md-1 align-items-center  d-flex">
                            <img src="https://randomuser.me/api/portraits/men/43.jpg" class="img-fluid m-2 rounded-4" alt="..." />
                        </div>
                        <div class="col-md-11">
                            <div class="card-body mx-2">
                                <h5 class="card-title">Customer Name</h5>
                                <div className="d-flex flex-column">
                                    <span className="card-text">Payment Method: <b>Instalment</b></span>
                                    <span className="">Amount: <b>PKR 20,000</b></span>
                                </div>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mb-3 rounded-4 shadow-sm position-relative" >
                    <span class="position-absolute top-0 p-3 start-0 translate-middle badge border border-light rounded-circle bg-warning">
                        <span class="visually-hidden">New alerts</span>

                    </span>
                    <div class="row g-0">
                        <div class="col-md-1 align-items-center  d-flex">
                            <img src="https://randomuser.me/api/portraits/men/43.jpg" class="img-fluid m-2 rounded-4" alt="..." />
                        </div>
                        <div class="col-md-11">
                            <div class="card-body mx-2">
                                <h5 class="card-title">Customer Name</h5>
                                <div className="d-flex flex-column">
                                    <span className="card-text">Payment Method: <b>Instalment</b></span>
                                    <span className="">Amount: <b>PKR 20,000</b></span>
                                </div>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mb-3 rounded-4 shadow-sm position-relative" >
                    <span class="position-absolute top-0 p-3 start-0 translate-middle badge border border-light rounded-circle bg-danger">
                        <span class="visually-hidden">New alerts</span>

                    </span>
                    <div class="row g-0">
                        <div class="col-md-1 align-items-center  d-flex">
                            <img src="https://randomuser.me/api/portraits/men/43.jpg" class="img-fluid m-2 rounded-4" alt="..." />
                        </div>
                        <div class="col-md-11">
                            <div class="card-body mx-2">
                                <h5 class="card-title">Customer Name</h5>
                                <div className="d-flex flex-column">
                                    <span className="card-text">Payment Method: <b>Instalment</b></span>
                                    <span className="">Amount: <b>PKR 20,000</b></span>
                                </div>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users