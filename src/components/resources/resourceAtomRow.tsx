import { TResourceAtom, TResourceAttribute } from "types";
import { TableCell, TableRow } from "../ui/table";
import { ExternalLink, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteAtom from "./deleteAtom";

export default function ResourceAtomRow({
  ra,
  attributes,
}: {
  ra: TResourceAtom;
  attributes: TResourceAttribute[];
}) {
  console.log(attributes);

  return (
    <TableRow>
      <TableCell>{ra.id}</TableCell>
      {attributes.map((a: TResourceAttribute) => {
        console.log(a.name, a.id);
        return (
          <TableCell>
            {a.type === "RESOURCE" ? (
              <p className="flex">
                <span className="px-2 py-1 rounded-tl rounded-bl bg-blue-600 text-white">
                  Resource
                </span>

                <Link
                  to={`/resource/${a.relationId}`}
                  className="bg-gray-700 shadow-sm text-white px-2 py-1 rounded-tr rounded-br max-w-max flex gap-2 items-center"
                >
                  <ExternalLink size={15} />
                  <span className="text-[14px]">{a.name}</span>
                </Link>
              </p>
            ) : (
              ra.data[a.name] || ""
            )}
          </TableCell>
        );
      })}
      <TableCell>
        <div className="flex gap-2 items-center">
          <Link to={`/resource/edit-item/${attributes[0].resourceId}/${ra.id}`}>
            <Edit
              onClick={() => console.log(ra.id)}
              className="text-gray-700"
            />
          </Link>{" "}
          <DeleteAtom atomId={ra.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}
