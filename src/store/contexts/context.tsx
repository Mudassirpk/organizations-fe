import React from 'react'
import { TUser } from '../../../types';

export type TAuthContext = {
  user: TUser | null
}

export const authContext = React.createContext<null | TAuthContext>(null);

export function useAuth() {
  const ctx = React.useContext(authContext)
  if (!ctx) throw new Error('useAuth should only be used in a an AuthContext');

  return ctx
}
