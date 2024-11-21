import Loader from "@/components/loader";
import AttributeInput from "@/components/resource-item/AttributeInput";
import { TDropdownSelectItem } from "@/components/resource-item/SearchDropdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { TResource, TResourceAtom, TResourceAttribute } from "types";

export default function EditItem() {
  const params = useParams();

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
      return (await axios.get(`http://localhost:3000/atom/${params.atomId}`))
        .data;
    },
  });

  const { data: attributes, isFetching: fetchingAttributes } = useQuery<
    TResourceAttribute[]
  >({
    queryKey: ["get-attribute_edit_atom"],
    async queryFn() {
      return (
        await axios.get(
          `http://localhost:3000/resource/attribute/${params.resourceId}`
        )
      ).data;
    },
  });

  // const {data} = useQuery({
  //   queryKey:'relation_resource_atom',
  // })

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
                        .map((k) => `${k}-${atomValues[k]}`)
                        .join("-"),
                    value: v,
                  };
                }
              ),
            },
          ]);
        }
      }
    }
  }, [isFetching, data, attributes]);

  return (
    <div className="w-full p-4">
      {isFetching ||
      fetchingAttributes ||
      // wait until all the realtions a set
      (attributes?.find((a) => a.type === "RESOURCE") &&
        relations.length === 0) ? (
        <Loader message="Loading atom data" />
      ) : (
        <form className="w-full">
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
        </form>
      )}
    </div>
  );
}
