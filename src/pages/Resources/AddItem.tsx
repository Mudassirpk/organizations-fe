import AttributeInput from "@/components/resource-item/AttributeInput";
import { TDropdownSelectItem } from "@/components/resource-item/SearchDropdown";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { TResource } from "types";

export default function AddItem() {
  const params = useParams();

  const [relations, setRelations] = useState<
    { name: string; value: TDropdownSelectItem[] }[]
  >([]);

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
    async mutationFn(data: unknown) {
      return (await axios.post("http://localhost:3000/resource/item", data))
        .data;
    },
    onSuccess(response) {
      if (response.success) {
        toast.success(`New ${data?.name} added successfully`);
      }
    },
  });

  // const {data} = useQuery({
  //   queryKey:'relation_resource_atom',
  // })

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data: { [key: string]: string | string[] | FormDataEntryValue } =
      Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));

    // append the selected resource for each relation to the formdata
    for (const relation of relations) {
      data[relation.name] = relation.value.map((r) => r.value) as string[];
    }

    const values = [];
    for (const v of Object.keys(data)) {
      values.push({
        name: v,
        value: data[v],
      });
    }

    if (params.resourceId)
      mutate({ values, resource: parseInt(params.resourceId) });
  }

  return (
    <div className="w-full p-4">
      {isFetching ? (
        <p>Loading....</p>
      ) : (
        <div className="w-full">
          <h2 className="font-semibold text-xl">Add new {data?.name}</h2>
          <form onSubmit={handleSubmit} className="my-4 flex flex-col gap-2">
            {data?.attributes.map((attribute, i: number) => {
              return (
                <>
                  <AttributeInput
                    setRelations={setRelations}
                    attribute={attribute}
                  />
                  {i !== data?.attributes.length - 1 && (
                    <p className="w-full border-b my-2"></p>
                  )}
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
