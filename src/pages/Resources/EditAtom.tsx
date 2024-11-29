import Loader from "@/components/loader";
import AttributeInput from "@/components/resource-item/AttributeInput";
import { TDropdownSelectItem } from "@/components/resource-item/SearchDropdown";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/query_client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { TResource, TResourceAtom, TResourceAttribute } from "types";
import {httpCommon} from "@/lib/httpCommon.ts";

export default function EditItem() {
  const params = useParams();
  const [relationsSet, setRelationsSet] = useState(false);

  const [relations, setRelations] = useState<
    { name: string; value: TDropdownSelectItem[] }[]
  >([]);

  const [initialValues, setInitialValues] = useState<
    { name: string; value: string }[]
  >([]);

  const { data, isFetching } = useQuery<
    TResourceAtom & { resource: TResource }
  >({
    queryKey: ["get-atom-to-edit"],
    async queryFn() {
      return (await httpCommon.get(`atom/${params.atomId}`))
        .data;
    },
  });

  const { data: attributes, isFetching: fetchingAttributes } = useQuery<
    TResourceAttribute[]
  >({
    queryKey: ["get-attribute_edit_atom"],
    async queryFn() {
      return (
        await httpCommon.get(
          `resource/attribute/${params.resourceId}`
        )
      ).data;
    },
  });

  const { mutate, status } = useMutation({
    async mutationFn(data: unknown) {
      return (
        await httpCommon.put(`atom/${params.atomId}`, data)
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({
          queryKey: ["get-attribute_edit_atom"],
        });
      } else {
        toast.error(response.message);
      }
    },
  });

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
      mutate({ values, resourceId: parseInt(params.resourceId) });
  }

  useEffect(() => {
    if (data && !isFetching && attributes) {
      const atomValues = data?.data;

      // first empty the relations
      setRelations([]);

      // set the initial relations and ALPHANUM values
      for (const attribute of attributes) {
        if (attribute.type === "ALPHANUM") {
          setInitialValues((prev) => [
            ...prev,
            { name: attribute.name, value: atomValues[attribute.name] },
          ]);
        } else if (
          attribute.type === "RESOURCE" &&
          atomValues[attribute.name] &&
          Array.isArray(atomValues[attribute.name])
        ) {
          setRelations((prev) => [
            ...prev,
            {
              name: attribute.name,
              value: (atomValues[attribute.name] as unknown as any[]).map(
                (v) => {
                  return {
                    label:
                      data?.id.toString() +
                      "-" +
                      Object.keys(atomValues)
                        .map((k) => `${k}|${atomValues[k]}`)
                        .join("-"),
                    value: v,
                  };
                }
              ),
            },
          ]);
        }
      }
      setRelationsSet(true);
    }
  }, [isFetching, data, attributes]);

  return (
    <div className="w-full p-4">
      <h2 className="font-semibold text-xl text-gray-700 pb-4 border-b mb-4">
        Edit resource atom
      </h2>
      {isFetching ||
      fetchingAttributes ||
      // wait until all the realtions a set
      (attributes?.find((a) => a.type === "RESOURCE") && !relationsSet) ? (
        <Loader message="Loading atom data" />
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          {attributes?.map((attribute: TResourceAttribute) => {
            return attribute.type === "RESOURCE" ? (
              // for relations
              <AttributeInput
                attribute={attribute}
                key={attribute.id}
                mode="edit"
                relations={relations}
                setRelations={setRelations}
              />
            ) : (
              // for normal ALPHANUM input
              <AttributeInput
                attribute={attribute}
                key={attribute.id}
                mode="edit"
                setRelations={setRelations}
                initialValue={initialValues.find(
                  (iv) => iv.name === attribute.name
                )}
                setInitialValues={setInitialValues}
              />
            );
          })}
          <div className="px-4 w-full">
            <Button className="mt-2 w-full" disabled={status == "pending"}>
              {status === "pending" ? <Loader /> : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
