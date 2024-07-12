import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './group_permissions.css';
import { useParams } from 'react-router-dom';

function Groups() {
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user.ind_id
    const [permissions, setPermissions] = useState([]);
    const [canEditPermissions, setCanEditPermissions] = useState(false);
    const { group_id } = useParams();

    useEffect(() => {
        fetchPermissions();
        fetchCanEdit();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/get_group_permissions?group_id=${group_id}`);
            setPermissions(response.data);
        } catch (error) {
            console.error('There was an error fetching the group permissions!', error);
        }
    }

    const fetchCanEdit = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/can_modify_group_permissions`, {"user_id": user_id, "group_id": group_id});
            setCanEditPermissions(response.data.Manage_mem);
        } catch (error) {
            console.error('There was an error determining if you are an admin!', error);
        }
    }

    const savePermissions = async () => {
        const permList = document.getElementById("permission-list");
        const rows = permList.children[1].children;
        let permissionData = [];
        for (let i = 0; i < rows.length; i++) {
            permissionData.push(
                {
                    "role_id": rows[i].children[5].textContent,
                    "manage_mem": rows[i].children[1].children[0].checked,
                    "create_sg": rows[i].children[2].children[0].checked,
                    "add_exp": rows[i].children[3].children[0].checked,
                    "modify_exp": rows[i].children[4].children[0].checked
                }
            )
        }
        axios.post(`http://127.0.0.1:5000/api/modify_group_permissions`, permissionData);
    }

    const handleEditChange = (index, field) => (event) => {
        const updatedPermissions = [...permissions];
        updatedPermissions[index] = {
            ...updatedPermissions[index],
            [field]: event.target.checked,
        };
        setPermissions(updatedPermissions);
    };

    if (canEditPermissions) {
        return (
            <div>
                <h1>Manage Group Permissions</h1>
                <table className='expense-list' id='permission-list'>
                    <thead>
                        <tr>
                            <th>Group Member</th>
                            <th>Can Manage Group Member Permissions</th>
                            <th>Can Create Group Spending Goal</th>
                            <th>Can Add Group Expense</th>
                            <th>Can Modify Group Expense</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((permission, index) => (
                            <tr>
                                <td>{permission.name}</td>
                                <td><input type='checkbox' checked={permission.Manage_mem} onChange={handleEditChange(index, 'Manage_mem')}></input></td>
                                <td><input type='checkbox' checked={permission.create_sg} onChange={handleEditChange(index, 'create_sg')}></input></td>
                                <td><input type='checkbox' checked={permission.add_exp} onChange={handleEditChange(index, 'add_exp')}></input></td>
                                <td><input type='checkbox' checked={permission.modify_exp} onChange={handleEditChange(index, 'modify_exp')}></input></td>
                                <td hidden={true}>{permission.role_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={savePermissions}>Save Permissions</button>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Manage Group Permissions</h1>
                <p>You do not have permission to manage permissions for this group!</p>
            </div>
        )
    }

   
}
export default Groups;
