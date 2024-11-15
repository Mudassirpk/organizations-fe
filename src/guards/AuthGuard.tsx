import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const naviate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      naviate("/login");
    }
  }, [naviate]);

  return children;
}
