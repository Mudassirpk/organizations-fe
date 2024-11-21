import { SetStateAction, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export type TDropdownSelectItem = { value: unknown; label: string };

type Props = {
  items: { value: string; label: string }[];
  selectedItems: TDropdownSelectItem[];
  setSelectedItems: React.Dispatch<SetStateAction<TDropdownSelectItem[]>>;
  disabled?: boolean;
};

const DropdownWithSearch = ({
  items,
  selectedItems,
  setSelectedItems,
  disabled,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleItemToggle = (item: TDropdownSelectItem) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.find((i) => i.value === item.value)
        ? prevSelectedItems.filter((i) => i.value !== item.value)
        : [...prevSelectedItems, item]
    );
  };

  const filteredItems = items.filter((item) =>
    item.label
      .toLowerCase()
      .replace(" ", "-")
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Container for selected items */}
      <div className="mb-4 p-2 border">
        {selectedItems.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {selectedItems.map((item, index) => {
              const id_splitted = item.label.replace("-", " ").split(" ");
              const id = id_splitted[0];
              return (
                <div key={item.label} className="flex items-center">
                  <span
                    key={index}
                    className="bg-blue-200 px-3 py-1 rounded-tl-full rounded-bl-full text-sm text-blue-700"
                  >
                    {id}
                  </span>
                  <span>
                    {id_splitted
                      .slice(1, id_splitted.length)
                      .join()
                      .split("-")
                      .map((i) => {
                        return (
                          <span key={i} className="mx-2">
                            <span className="rounded-tl p-1 rounded-bl bg-blue-600 text-white">
                              {i.split("|")[0]}
                            </span>
                            <span className="rounded-tr p-1 rounded-br bg-gray-800 text-white">
                              {i.split("|")[1]}
                            </span>
                          </span>
                        );
                      })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-gray-500">No items selected</span>
        )}
      </div>

      {/* Dropdown with search */}
      <Select
        disabled={disabled}
        onValueChange={(e) => {
          const v = items.find((i) => i.value === e);
          if (v) handleItemToggle(v);
        }}
      >
        <SelectTrigger className="w-full">
          <span className="text-gray-700">Select Items</span>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-3"
            />
            <div className="max-h-60 overflow-auto">
              {filteredItems.map((item) => (
                <SelectItem key={item.value} value={item.value.toString()}>
                  <div className="w-full flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={
                        selectedItems.find((i) => {
                          return (
                            (i.value as string | number).toString() ===
                            item.value
                          );
                        })
                          ? true
                          : false
                      }
                    />
                    <p className="flex w-full gap-2 items-center">
                      {item.label.split("-").map((l) => {
                        return (
                          <span
                            key={l}
                            className="py-1 px-2 rounded bg-blue-500/20 text-blue-600"
                          >
                            {l}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </div>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownWithSearch;
