import Resource from "@/components/resources/resource";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/contexts/context";
import axios from "axios";
import { TResource } from "types";

export default function Resources() {
  const { user } = useAuth();

  const { data, isFetching } = useQuery<TResource[]>({
    queryKey: ["get-resources"],
    async queryFn() {
      return (
        await axios.get(
          `http://localhost:3000/resource/${user?.user_organization[0].organization.id}?attributes=true&atoms=true`
        )
      ).data;
    },
  });

  console.log(data);

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <h2 className="text-gray-700 text-2xl font-semibold">Resources</h2>
        <Link
          to={"/add-resource"}
          className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-500"
        >
          Add new resource
        </Link>
      </div>

      <div className="w-full p-4 grid gap-2 grid-cols-4">
        {isFetching ? (
          <p>Loading.....</p>
        ) : (
          data?.map((resource) => {
            return (
              <Resource
                id={resource.id}
                title={resource.name}
                createdAt={resource.createdAt}
                attributes={resource.attributes}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
