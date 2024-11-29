import Resource from "@/components/resources/resource";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/contexts/context";
import { TResource } from "types";
import {httpCommon} from "@/lib/httpCommon.ts";

export default function Resources() {
  const { user } = useAuth();

  const { data, isFetching } = useQuery<TResource[]>({
    queryKey: ["get-resources"],
    async queryFn() {
      return (
        await httpCommon.get(
          `resource/${user?.user_organization[0].organization.id}?attributes=true&atoms=true`
        )
      ).data;
    },
  });

  console.log(data);

  return (
    <div>
      <div className="w-full flex justify-between py-2 sm:py-0 items-center">
        <h2 className="text-gray-700 text-2xl font-semibold">Resources</h2>
        <Link
          to={"/add-resource"}
          className="bg-blue-600 text-white rounded-md py-2 text-[14px] px-2 hover:bg-blue-500"
        >
          Add new resource
        </Link>
      </div>
      <div className="my-2 border-t w-full visible sm:hidden"></div>
      <div className="w-full p-2 sm:p-4 grid gap-2 grid-cols-1 sm:grid-cols-4">
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
