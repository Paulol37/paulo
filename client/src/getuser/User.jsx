import React, { useEffect, useState } from "react"
import "./user.css"
import axios from "axios"

const User = () => {
    const [user, setUsers] =useState ([])
    useEffect(()=>{
        const fetchData = async()=>{
            try {

            const response = await axios.get("http://localhost:8000/api/user");
            setUsers (response.data) 

            } catch (error){
                console.log("Error while fetching data", error)
            }
        };
        fetchData()
    },[])

    return (
        <div className="userTable">
            <button type="button" class="btn btn-success">Add User <i class="fa-solid fa-user-plus"></i></button>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Number</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((user, index)=>{
                            return(
                       <tr>
                            <td>{index+1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>24</td>
                            <td className="actionButtons">
                                <button type="button" class="btn btn-info"><i class="fa-regular fa-pen-to-square"></i></button>
                                <button type="button" class="btn btn-warning"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                            )
                        })}
                       
                    </tbody>
                </table>
        </div>
    )
};

export default User