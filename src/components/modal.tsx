import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import React, {SetStateAction} from "react";
import {twMerge} from "tailwind-merge";

type Props = {
    title: string;
    triggerTitle: string;
    description?: string;
    children: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    customTrigger?: React.ReactNode
    triggerStyles?: string
};

function Modal({
                   title,
                   description,
                   children,
                   triggerTitle,
                   open,
                   setOpen,
                   customTrigger,
                   triggerStyles
               }: Props) {
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger
                className={twMerge('bg-blue-600 text-white hover:bg-blue-500 rounded px-3 py-1',triggerStyles)}>{customTrigger || triggerTitle}</DialogTrigger>
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
