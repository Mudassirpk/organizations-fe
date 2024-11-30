import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { httpCommon } from "@/lib/httpCommon";
import { useAuth } from "@/store/contexts/context";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddRole() {
  const { user, token } = useAuth();
  const [data, setData] = useState({
    roleName: "",
    organizationId: user?.user_organization[0].organizationId
  });

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post("http://localhost:3000/role", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
  });

  return (
    <div>
      <h2 className={"w-full font-semibold text-2xl text-gray-700"}>
        Add Role
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className={"w-full mt-4 space-y-4"}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={data.roleName}
            onChange={(e) => setData({ ...data, roleName: e.target.value })}
            placeholder="Name"
            required
          />
        </div>
        <Button disabled={status === "pending"}>Add Role</Button>
      </form>
    </div>
  );
}
