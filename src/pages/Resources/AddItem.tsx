import AttributeInput from "@/components/resource-item/AttributeInput";
import { Button } from "@/components/ui/button";
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
          `http://localhost:3000/resource/by-id/${params.resourceId}?atoms=true&attributes=true`
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

  // const {data} = useQuery({
  //   queryKey:'relation_resource_atom',
  // })

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
              for (const v of Object.keys(data)) {
                values.push({
                  name: v,
                  value: data[v],
                });
              }

              mutate({ values, resource: parseInt(params.resourceId as any) });
            }}
            className="my-4 flex flex-col gap-2"
          >
            {data?.attributes.map((attribute,i:number) => {
              return (
                <>
                  <AttributeInput attribute={attribute} />
                  {i!==data?.attributes.length-1 && <p className="w-full border-b my-2"></p>}
                </>
              );
            })}
            <Button type="submit">Add {data?.name}</Button>
          </form>
        </div>
      )}
    </div>
  );
}
