import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SidebarCollapsible({
  title,
  links,
  Icon,
}: {
  title: string;
  Icon: LucideIcon;
  links: { path: string; name: string; Icon: LucideIcon }[];
}) {
  const [isResourceLinksOpen, setIsResourceLinksOpen] = useState(false);
  return (
    <Collapsible
      open={isResourceLinksOpen}
      onOpenChange={setIsResourceLinksOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between mb-1">
          <div className="flex items-center">
            {<Icon className="mr-2 h-4 w-4" />} {title}
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              isResourceLinksOpen ? "rotate-90" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-4 flex flex-col gap-2">
        {links.map((link) => {
          return (
            <Link to={link.path} className="w-full flex gap-2 hover:bg-gray-50 p-2 items-center cursor-pointer justify-start pl-6">
              <link.Icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
