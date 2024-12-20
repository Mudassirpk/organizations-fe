import Modal from "@/components/modal.tsx";
import React, { FormEvent } from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/query_client.ts";
import { useAuth } from "@/store/contexts/context";
import {httpCommon} from "@/lib/httpCommon.ts";

export default function AddRoleModal() {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();

  const { mutate, status } = useMutation({
    async mutationFn(data: { roleName: string; organizationId?: number }) {
      return (await httpCommon.post("role", data)).data;
    },
    onSuccess(response) {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["get-organization-roles"] });
      } else {
        toast.error(response.message);
      }
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    mutate({
      roleName: formData.get("name") as string,
      organizationId: user?.user_organization[0].organizationId,
    });
  }

  return (
    <Modal
      title={"Add Role"}
      triggerTitle={"Add Role"}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit} className={"flex flex-col gap-2"}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" required />
        </div>
        <Button
          disabled={status === "pending"}
          className={
            "disabled:bg-gray-400 w-full bg-blue-600 hover:bg-blue-500 text-white"
          }
        >
          Add Role
        </Button>
      </form>
    </Modal>
  );
}
