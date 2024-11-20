import Modal from "../modal";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { queryClient } from "@/lib/query_client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

function DeleteAtom({ atomId }: { atomId: number }) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteAtom, status } = useMutation({
    async mutationFn(atomId: number) {
      return (await axios.delete(`http://localhost:3000/atom/${atomId}`)).data;
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
    <Modal open={open} setOpen={setOpen} title="Delete" triggerTitle="Delete">
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
