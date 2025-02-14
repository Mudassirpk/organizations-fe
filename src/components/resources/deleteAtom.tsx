import Modal from "../modal";
import { Button } from "../ui/button";
import {Loader, Trash} from "lucide-react";
import { queryClient } from "@/lib/query_client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import {httpCommon} from "@/lib/httpCommon.ts";

function DeleteAtom({ atomId }: { atomId: number }) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteAtom, status } = useMutation({
    async mutationFn(atomId: number) {
      return (await httpCommon.delete(`atom/${atomId}`)).data;
    },
    onSuccess(response) {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["get-resource-details"] });
      } else {
        toast.error(response.message);
      }
    },
  });

  return (
    <Modal customTrigger={<Trash className={'text-2xl text-red-600 hover:text-red-500'} />} open={open} setOpen={setOpen} title="Delete" triggerTitle="Delete">
      <p>Do you really want to delete this atom</p>
      <div className="w-full flex justify-end gap-2 items-center">
        <Button variant={"ghost"} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          disabled={status === "pending"}
          variant={"destructive"}
          onClick={() => {
            deleteAtom(atomId);
          }}
        >
          {status === "pending" ? <Loader /> : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteAtom;
