import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SetStateAction } from "react";

type Props = {
  title: string;
  triggerTitle: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

function Modal({
  title,
  description,
  children,
  triggerTitle,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>{triggerTitle}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="p-2 w-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
