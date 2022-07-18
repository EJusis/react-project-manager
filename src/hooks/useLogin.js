import { useState, useEffect } from 'react'
import {projectAuth, projectFirestore} from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
  
    try {

      // login
      const res = await projectAuth.signInWithEmailAndPassword(email, password)

      // updating online status
      await projectFirestore.collection('users').doc(res.user.uid)
          .update({ online: true })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })


      if (!isCancelled) {
        setIsPending(false)
        setError(null)
        navigate('/')
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

  return { login, isPending, error }
}