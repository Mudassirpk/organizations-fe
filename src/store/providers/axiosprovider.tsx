import React, { useEffect, useState } from "react";
import { httpCommon } from "@/lib/httpCommon.ts";
import Loader from "@/components/loader.tsx";

export default function AxiosProvider({ children }: { children: React.ReactNode }) {

  const [tokenAdded, setTokenAdded] = useState(false)

  useEffect(() => {
    // add auth token to headers of all the axios requests
    httpCommon.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
      return config
    })
    setTokenAdded(true)
  }, []);

  return !tokenAdded ? <Loader /> : children
}