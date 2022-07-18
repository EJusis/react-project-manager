import { useEffect, useState } from 'react'
import {projectAuth, projectFirestore} from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'


export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()
  const navigate = useNavigate()
  
  const logout = async () => {
    setError(null)
    setIsPending(true)

    // sign the user out

    try {
      // update online status
      const { uid } = user
      await projectFirestore.collection('users').doc(uid).update({ online: false })


      await projectAuth.signOut()
      
      // dispatch logout action
      dispatch({ type: 'LOGOUT' })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
        navigate('/login')
      } 
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    setIsCancelled(false)
    return () => setIsCancelled(true)
  }, [])

  return { logout, error, isPending }
}