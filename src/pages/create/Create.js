import React, {useEffect} from 'react';
import './Create.css'
import {useState} from "react";
import Select from 'react-select'
import {useCollection} from "../../hooks/useCollection";
import {timestamp} from "../../firebase/config";
import {useAuthContext} from "../../hooks/useAuthContext";
import {useFirestore} from "../../hooks/useFirestore";
import {useNavigate} from "react-router-dom";

const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
]


const Create = () => {
    const { addDocument, response } = useFirestore('projects')
    const { user } = useAuthContext()
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [category, setCategory] = useState('')
    const [assignedUsers, setAssignedUsers] = useState([])
    const [users, setUsers] = useState([])
    const [formError, setFormError] = useState(null)
    const navigate = useNavigate()

    const { documents } = useCollection('users')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        if (!category) {
            setFormError('Please select a project category')
            return
        }
        if (assignedUsers.length < 1) {
            setFormError('Please assign the project to at least 1 user')
            return
        }

        const createdBy = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid
        }

        const assignedUsersList = assignedUsers.map(user => {
            return {
                displayName: user.value.displayName,
                photoURL: user.value.photoURL,
                id: user.value.id
            }
        })

        const project = {
            name,
            details,
            category: category.value,
            dueDate: timestamp.fromDate(new Date(dueDate)),
            comments: [],
            createdBy,
            assignedUsersList
        }

        await addDocument(project)
        if (!response.error) {
            navigate('/')
        }
    }

    useEffect(() => {

        if(documents) {
            const options = documents.map(user => {
                return { value: user, label: user.displayName}
            })
            setUsers(options)
        }

    }, [documents])

    return (
        <div className='create-form'>
            <h2 className="page-title">
                Create a new project
            </h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Name</span>
                    <input
                        type="text"
                        required
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                </label>
                <label>
                    <span>Project details:</span>
                    <textarea
                        required
                        onChange={e => setDetails(e.target.value)}
                        value={details}
                    />
                </label>
                <label>
                    <span>Set due date:</span>
                    <input
                        type='date'
                        required
                        onChange={e => setDueDate(e.target.value)}
                        value={dueDate}
                    />
                </label>
                <label>
                    <span>Project category:</span>
                    <Select
                        options={categories}
                        onChange={(option) => setCategory(option)}
                    />
                </label>
                <label>
                    <span>Assign to:</span>
                    <Select
                        options={users}
                        onChange={(option) => setAssignedUsers(option)}
                        isMulti
                    />
                </label>
                <button className="btn">Add Project</button>
                {formError && <div className='error'>{formError}</div>}
            </form>
        </div>
    );
};

export default Create;