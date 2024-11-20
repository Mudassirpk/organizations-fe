import React, { useContext } from "react";
import { SetStateAction } from "react";

export type TModalContext = {
  open: boolean;
  close: () => void;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export const modalContext = React.createContext<TModalContext | null>(null);

export function useModal() {
  const ctx = useContext(modalContext);

  if (!ctx) {
    throw new Error("useModal should only be used insided ModalContext");
  }

  return ctx;
}
