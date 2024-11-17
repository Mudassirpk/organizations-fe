import { useEffect, useState } from "react"
import { authContext } from "../contexts/context"
import { TUser } from '../../../types';
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const values = { user }
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/login');
    } else {
      setUser(JSON.parse(user))
    }
  }, [])

  return <authContext.Provider value={values}>{children}</authContext.Provider>
}
