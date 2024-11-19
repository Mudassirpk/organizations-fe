import { SetStateAction, useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const filteredItems = items.filter((item) =>
    item.label
      .toLowerCase()
      .replace(" ", "-")
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Container for selected items */}
      <div className="mb-4">
        {selectedItems.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {selectedItems.map((item, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
              >
                {item.label}
              </span>
            ))}
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
                        selectedItems.find((i) => i.value === item.value)
                          ? true
                          : false
                      }
                    />
                    <p className="flex w-full gap-2 items-center">
                      {item.label.split("-").map((l) => {
                        return (
                          <span className="py-1 px-2 rounded bg-blue-500/20 text-blue-600">
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
