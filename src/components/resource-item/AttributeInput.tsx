import { TResource, TResourceAttribute } from "types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";
import DropdownWithSearch, { TDropdownSelectItem } from "./SearchDropdown";
import { SetStateAction, useEffect, useState } from "react";
import {httpCommon} from "@/lib/httpCommon.ts";
export default function AttributeInput({
  attribute,
  setRelations,
  initialValue,
  setInitialValues,
  mode,
  relations,
}: {
  attribute: TResourceAttribute;
  setRelations: React.Dispatch<
    SetStateAction<{ name: string; value: TDropdownSelectItem[] }[]>
  >;
  initialValue?: { name: string; value: string };
  setInitialValues?: React.Dispatch<
    SetStateAction<{ name: string; value: string }[]>
  >;
  mode?: "edit" | "add";
  relations?: { name: string; value: TDropdownSelectItem[] }[];
}) {
  const [selectedItems, setSelectedItems] = useState<TDropdownSelectItem[]>(
    mode === "edit" && relations
      ? relations
          ?.filter((r) => r.name === attribute.name)
          .map((r) => r.value)
          .flat()
      : []
  );
  const [useAllResourceItems, setUseAllResourceItems] =
    useState<boolean>(false);

  const { data, isFetching } = useQuery<TResource>({
    queryKey: ["attribute-relation-resource"],
    async queryFn() {
      return (
        await httpCommon.get(
          `resource/by-id/${attribute.relationId}?atoms=true`
        )
      ).data;
    },
    enabled: attribute.type === "RESOURCE",
  });

  // update the relations
  useEffect(() => {
    if (attribute.type === "RESOURCE") {
      if (useAllResourceItems) {
        setRelations((prev) => prev.filter((p) => p.name !== attribute.name));
      } else {
        if (selectedItems.length > 0) {
          const present = relations?.find((r) => r.name === attribute.name);
          if (present) {
            // add updated
            setRelations((prev) => {
              return prev.map((p) => {
                if (p.name === attribute.name) {
                  p = { ...p, value: selectedItems };
                }

                return p;
              });
            });
          } else {
            setRelations((prev) => [
              ...prev,
              { name: attribute.name, value: selectedItems },
            ]);
          }
        }
      }
    }
  }, [selectedItems, useAllResourceItems]);

  return (
    <div key={attribute.id} className="space-y-2">
      <Label
        className="capitalize flex justify-between items-center"
        htmlFor={attribute.id.toString()}
      >
        {useAllResourceItems && (
          // value of default all will be picked for attribute if we are using all resource atoms
          <input
            type="text"
            name={attribute.name}
            value={"All"}
            className="hidden"
          />
        )}
        <span>{attribute.name}</span>{" "}
        {attribute.type === "RESOURCE" && attribute.relationType === "OTM" && (
          <label
            htmlFor={attribute.name}
            className={`flex gap-2 items-center hover:border-blue-500 cursor-pointer p-2 rounded border ${
              useAllResourceItems && "border-blue-500"
            }`}
          >
            {" "}
            <span>Use all resource items</span>
            <Input
              id={attribute.name}
              type="checkbox"
              checked={useAllResourceItems}
              onChange={(e) => {
                setUseAllResourceItems(e.target.checked);
              }}
              className="w-5 h-5"
            />
          </label>
        )}
      </Label>
      {attribute.type === "RESOURCE" ? (
        isFetching ? (
          <Loader />
        ) : attribute.relationType === "OTO" ? (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Choose " + attribute.name} />
            </SelectTrigger>
            <SelectContent>
              {data?.resource_atom.map((ra, i: number) => {
                return (
                  <>
                    <SelectItem
                      value={ra.id.toString()}
                      className={`py-2 cursor-pointer`}
                    >
                      {
                        <div className="w-full flex gap-2 items-center flex-wrap p-1">
                          {Object.keys(ra.data).map((k) => {
                            return (
                              <p className="min-w-max rounded text-[16px]">
                                <span className="p-1 px-2 bg-gray-700 rounded-tl rounded-bl text-white">
                                  {k}
                                </span>
                                <span className="p-1 px-2 rounded-tr rounded-br bg-purple-700 text-white">
                                  {ra.data[k]}
                                </span>
                              </p>
                            );
                          })}
                        </div>
                      }
                    </SelectItem>
                    {i !== data?.resource_atom.length - 1 && (
                      <p className="my-2 w-full border-b"></p>
                    )}
                  </>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          <DropdownWithSearch
            disabled={useAllResourceItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            items={
              data?.resource_atom.map((ra) => {
                return {
                  label:
                    ra.id.toString() +
                    "-" +
                    Object.keys(ra.data)
                      .map((k) => `${k}-${ra.data[k]}`)
                      .join("-"),
                  value: ra.id.toString(),
                };
              }) || []
            }
          />
        )
      ) : mode && mode === "edit" && initialValue && setInitialValues ? (
        <div className="w-full px-4">
          <Input
            value={initialValue.value}
            onChange={(e) => {
              setInitialValues((prev) => {
                return prev.map((p) => {
                  if (p.name === initialValue.name) {
                    p.value = e.target.value;
                  }
                  return p;
                });
              });
            }}
            name={attribute.name}
            id={attribute.id.toString()}
            type="text"
            placeholder={attribute.name}
            required
          />
        </div>
      ) : (
        <div className="w-full px-4">
          <Input
            name={attribute.name}
            id={attribute.id.toString()}
            type="text"
            placeholder={attribute.name}
            required
          />
        </div>
      )}
    </div>
  );
}
