import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TResource, TResourceAtom } from "types";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

export default function ResourceDetails() {
  const { data, isFetching } = useQuery<
    TResource & {
      resource_atom: TResourceAtom[];
    }
  >({
    queryKey: ["get-resource-details"],
    async queryFn() {
      return (
        await axios.get(
          `http://localhost:3000/resource/by-id/${params.resourceId}`
        )
      ).data;
    },
  });

  const params = useParams();
  return (
    <div className="w-full p-4">
      {isFetching ? (
        <p>Loading.....</p>
      ) : (
        <div>
          <div className="w-full flex justify-between">
            <h2 className="text-2xl font-semibold">{data?.name}</h2>
            <Link
              className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
              to={`/resource/add-item/${params.resourceId}`}
            >
              Add New {data?.name}
            </Link>
          </div>
          <div className="border rounded overflow-hidden my-4">
            {" "}
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 font-semibold capitalize">
                  <TableCell className="capitalize">ID</TableCell>
                  {data?.attributes.map((attribute) => {
                    return (
                      <TableCell key={attribute.id}>{attribute.name}</TableCell>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.resource_atom.map((ra) => {
                  return (
                    <TableRow>
                      <TableCell>{ra.id}</TableCell>
                      {Object.values(ra.data).map((v) => {
                        return <TableCell>{v as string}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {data?.resource_atom.length === 0 && (
              <p className="w-full p-4 text-gray-700 text-lg font-semibold text-center">
                No {data?.name}s found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
