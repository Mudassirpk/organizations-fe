import { useModal } from "@/store/contexts/modalcontext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  title: string;
  triggerTitle: string;
  description?: string;
  children: React.ReactNode;
};

function Modal({ title, description, children, triggerTitle }: Props) {
  const { open, setOpen } = useModal();

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
