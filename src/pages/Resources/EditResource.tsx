import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/store/contexts/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus, SquareX } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { TResource } from "types";

export default function EditResource() {
  const { user } = useAuth();
  const params = useParams();
  const [name, setName] = useState<string>("");
  const [attributes, setAttributes] = useState<
    {
      name: string;
      type: "ALPHANUM" | "MEDIA";
      id?: number;
      delete?: boolean;
    }[]
  >([]);

  const { mutate, status } = useMutation({
    async mutationFn() {
      const data: { [key: string]: any } = {};

      if (name !== resourceToEdit?.name) {
        data.name = name;
      }

      return (
        await axios.post(
          "http://localhost:3000/resource/update",
          {
            name: name,
            attributes,
            resourceId: parseInt(params.resourceId as any),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      ).data;
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || data.error);
      }
    },
  });

  const { data: resourceToEdit, isFetching: fetchingResourceToEdit } =
    useQuery<TResource>({
      queryKey: ["get-resource-to-edit"],
      async queryFn() {
        return (
          await axios.get(
            "http://localhost:3000/resource/by-id/" + params.resourceId
          )
        ).data;
      },
    });

  useEffect(() => {
    if (resourceToEdit && !fetchingResourceToEdit) {
      setName(resourceToEdit.name);
      setAttributes(
        resourceToEdit.attributes.map((attribute) => {
          return {
            name: attribute.name,
            type: attribute.type,
            id: attribute.id,
          };
        })
      );
    }
  }, [resourceToEdit, fetchingResourceToEdit]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    mutate();
  }

  return (
    <div className="w-full">
      <h2 className="font-semibold text-2xl text-gray-700">Edit Resource</h2>
      {fetchingResourceToEdit ? (
        <Loader message="Loading resource" />
      ) : (
        <form onSubmit={handleSubmit} className="my-2 flex flex-col gap-2">
          <div className="space-y-2">
            <Label htmlFor="resourceName">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="resourceName"
              type="text"
              placeholder="Resource name"
              required
            />
          </div>

          <p className="w-full font-semibold text-xl my-2">Attributes</p>
          {attributes.map((attribute, attribute_index) => {
            return (
              !attribute.delete && (
                <div
                  key={attribute_index}
                  className="space-y-2 flex gap-2 items-center"
                >
                  <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <span>Name</span>
                      <Input
                        value={attributes[attribute_index].name}
                        onChange={(e) => {
                          setAttributes((prev) => {
                            return prev.map((p, index: number) => {
                              if (attribute_index === index) {
                                p = { ...p, name: e.target.value };
                              }
                              return p;
                            });
                          });
                        }}
                        id="resourceName"
                        type="text"
                        placeholder="Resource name"
                        required
                      />{" "}
                    </div>
                    <div>
                      <span>Type</span>
                      <Select
                        value={attribute.type}
                        onValueChange={(e) => {
                          setAttributes((prev) => {
                            return prev.map((p, index: number) => {
                              if (attribute_index === index) {
                                p = { ...p, type: e as any };
                              }
                              return p;
                            });
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALPHANUM">
                            Alphanum (number, text)
                          </SelectItem>
                          <SelectItem value="MEDIA" disabled>
                            Media (video, image, file, or a document)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <SquareX
                    onClick={() => {
                      setAttributes((prev) =>
                        prev.map((_p, i: number) => {
                          if (i === attribute_index) {
                            _p.delete = true;
                          }
                          return _p;
                        })
                      );
                    }}
                    className="text-2xl cursor-pointer hover:text-red-500 text-red-600"
                  />
                </div>
              )
            );
          })}
          <Button
            type="button"
            onClick={() => {
              setAttributes((prev) => [
                ...prev,
                { name: "", type: "ALPHANUM" },
              ]);
            }}
            className="flex gap-2 items-center"
          >
            <Plus /> <span>Add</span>
          </Button>
          <Button type="submit">
            {status === "pending" ? <p>loading....</p> : "Add Resource"}
          </Button>
        </form>
      )}
    </div>
  );
}
