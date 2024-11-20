import Loader from "@/components/loader";
import AttributeInput from "@/components/resource-item/AttributeInput";
import { TDropdownSelectItem } from "@/components/resource-item/SearchDropdown";
import { Button } from "@/components/ui/button";
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
      {isFetching && fetchingAttributes ? (
        <Loader />
      ) : attributes?.filter((a) => a.type === "RESOURCE")?.length &&
        attributes?.filter((a) => a.type === "RESOURCE")?.length > 0 ? (
        relations &&
        relations.length && (
          <div className="w-full">
            <h2 className="font-semibold text-xl">
              Edit {data?.resource.name} Atom
            </h2>
            <form onSubmit={handleSubmit} className="my-4 flex flex-col gap-2">
              {attributes?.map((attribute, i: number) => {
                return (
                  <React.Fragment key={attribute.id}>
                    <AttributeInput
                      relations={relations}
                      setRelations={setRelations}
                      attribute={attribute}
                      initialValue={initialValues.find(
                        (iv) => iv.name === attribute.name
                      )}
                      setInitialValues={setInitialValues}
                      mode="edit"
                    />
                    {i !== attributes.length - 1 && (
                      <p className="w-full border-b my-2"></p>
                    )}
                  </React.Fragment>
                );
              })}
              <Button type="submit">Save Changes</Button>
            </form>
          </div>
        )
      ) : (
        <div className="w-full">
          <h2 className="font-semibold text-xl">
            Edit {data?.resource.name} Atom
          </h2>
          <form onSubmit={handleSubmit} className="my-4 flex flex-col gap-2">
            {attributes?.map((attribute, i: number) => {
              return (
                <React.Fragment key={attribute.id}>
                  <AttributeInput
                    relations={relations}
                    setRelations={setRelations}
                    attribute={attribute}
                    initialValue={initialValues.find(
                      (iv) => iv.name === attribute.name
                    )}
                    setInitialValues={setInitialValues}
                    mode="edit"
                  />
                  {i !== attributes.length - 1 && (
                    <p className="w-full border-b my-2"></p>
                  )}
                </React.Fragment>
              );
            })}
            <Button type="submit">Save Changes</Button>
          </form>
        </div>
      )}
    </div>
  );
}
