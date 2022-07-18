import React, {useState} from 'react';
import './Dashboard.css'
import {useCollection} from "../../hooks/useCollection";
import ProjectList from "../../components/ProjectList";
import ProjectFilter from "./ProjectFilter";
import {useAuthContext} from "../../hooks/useAuthContext";

const Dashboard = () => {
    const { documents, error } = useCollection('projects')
    const [filter, setFilter] = useState('all')
    const { user } = useAuthContext()

    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const projects = documents ? documents.filter((document) => {
        switch (filter) {
            case 'all':
                return true
            case 'mine':
                let assignedToMe = false
                document.assignedUsersList.forEach(u => {
                    if(u.id === user.uid) {
                        assignedToMe = true
                    }
                })
                return assignedToMe
            case 'development':
            case 'design':
            case 'sales':
            case 'marketing':
                return document.category === filter
            default:
                return true
        }

    }) : null

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            {error && <p className='error'>{error}</p>}
            {documents && <ProjectFilter changeFilter={changeFilter}/>}
            {documents && <ProjectList projects={projects} />}
        </div>
    );
};

export default Dashboard;