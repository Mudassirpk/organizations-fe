import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/store/contexts/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { TRole } from "types";

export default function AddUser() {
  const { user, token } = useAuth();
  const [data, setData] = useState<{
    name: string;
    email: string;
    roleId: null | number;
  }>({
    name: "",
    email: "",
    roleId: null,
  });

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await axios.post("http://localhost:3000/user/member/add", data, {
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

  const { data: roles, isFetching: fetchingRoles } = useQuery<TRole[]>({
    queryKey: ["get-organization-roles"],
    async queryFn() {
      return (
        await axios.get(
          `http://localhost:3000/role/by-organization/${user?.user_organization[0].organizationId}`
        )
      ).data;
    },
  });

  return (
    <div>
      <h2 className={"w-full font-semibold text-2xl text-gray-700"}>
        Add User
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!data.roleId) {
            toast.error("Please choose role");
          } else {
            mutate();
          }
        }}
        className={"w-full mt-4 space-y-4"}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="example@domain.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Role</Label>
          {fetchingRoles ? (
            <Loader message="Loading roles" />
          ) : (
            <Select
              onValueChange={(v) => setData({ ...data, roleId: parseInt(v) })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Role</SelectLabel>
                  {roles?.map((role) => {
                    return (
                      <SelectItem value={role.id.toString()} key={role.id}>
                        {role.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <Button disabled={status === "pending"}>Add User</Button>
      </form>
    </div>
  );
}
