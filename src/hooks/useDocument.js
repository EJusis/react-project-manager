import {useEffect, useState} from "react";
import { projectFirestore } from "../firebase/config"


export const useDocument = (collection, id) => {
    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const ref = projectFirestore.collection(collection).doc(id)

      const unsubscribe = ref.onSnapshot(snapshot => {
          if (snapshot.data()) {
              setDocument({...snapshot.data(), id: snapshot.id })
              setError(null)
          } else {
              setError('The project with this particular ID does not exist')
          }

        }, (err) => {
            console.log(err.message)
            setError('failed to get document')
        })

        return () => unsubscribe()

    }, [collection, id])

    return { document, error }
}