import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TResource } from "types";

export default function AddItem() {
  const params = useParams();
  const { data, isFetching } = useQuery<TResource>({
    queryKey: ["get-resource-details_add_item"],
    async queryFn() {
      return (
        await axios.get(
          `http://localhost:3000/resource/by-id/${params.resourceId}`
        )
      ).data;
    },
  });

  const { mutate } = useMutation({
    async mutationFn(data: any) {
      return (await axios.post("http://localhost:3000/resource/item", data))
        .data;
    },
  });

  return (
    <div className="w-full p-4">
      {isFetching ? (
        <p>Loading....</p>
      ) : (
        <div className="w-full">
          <h2 className="font-semibold text-xl">Add new {data?.name}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              const values = [];
              for (let v of Object.keys(data)) {
                values.push({
                  name: v,
                  value: data[v],
                });
              }

              mutate({ values, resource: parseInt(params.resourceId as any) });
            }}
            className="my-4 flex flex-col gap-2"
          >
            {data?.attributes.map((attribute) => {
              return (
                <div key={attribute.id} className="space-y-2">
                  <Label
                    className="capitalize"
                    htmlFor={attribute.id.toString()}
                  >
                    {attribute.name}
                  </Label>
                  <Input
                    name={attribute.name}
                    id={attribute.id.toString()}
                    type="organizationId"
                    placeholder={attribute.name}
                    required
                  />
                </div>
              );
            })}
            <Button type="submit">Add {data?.name}</Button>
          </form>
        </div>
      )}
    </div>
  );
}
