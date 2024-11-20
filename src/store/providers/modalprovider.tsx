import { useState } from "react";
import { modalContext } from "../contexts/modalcontext";

function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  const values = {
    open,
    close,
    setOpen,
  };

  return (
    <modalContext.Provider value={values}>{children}</modalContext.Provider>
  );
}

export default ModalProvider;
