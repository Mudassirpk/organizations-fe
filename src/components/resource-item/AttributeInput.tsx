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
import axios from "axios";
import Loader from "../loader";
import DropdownWithSearch, { TDropdownSelectItem } from "./SearchDropdown";
import { useState } from "react";

export default function AttributeInput({
  attribute,
}: {
  attribute: TResourceAttribute;
}) {
  const [selectedItems, setSelectedItems] = useState<TDropdownSelectItem[]>([]);
  const [useAllResourceItems, setUseAllResourceItems] =
    useState<boolean>(false);

  const { data, isFetching } = useQuery<TResource>({
    queryKey: ["attribute-relation-resource"],
    async queryFn() {
      return (
        await axios.get(
          `http://localhost:3000/resource/by-id/${attribute.relationId}?atoms=true`
        )
      ).data;
    },
    enabled: attribute.type === "RESOURCE",
  });

  return (
    <div key={attribute.id} className="space-y-2">
      <Label
        className="capitalize flex justify-between items-center"
        htmlFor={attribute.id.toString()}
      >
        <span>{attribute.name}</span>{" "}
        <label
          htmlFor={attribute.name}
          className={`flex gap-2 items-center cursor-pointer p-2 rounded border ${
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
                      .map((k) => `${k} : ${ra.data[k]}`)
                      .join("-"),
                  value: ra.id.toString(),
                };
              }) || []
            }
          />
        )
      ) : (
        <Input
          name={attribute.name}
          id={attribute.id.toString()}
          type="organizationId"
          placeholder={attribute.name}
          required
        />
      )}
    </div>
  );
}
