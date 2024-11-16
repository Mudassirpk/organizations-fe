import Resource from "@/components/resources/resource";
import { Link } from "react-router-dom";

export default function Resources() {
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
        <Resource />
        <Resource />
        <Resource />
        <Resource />
        <Resource />
        <Resource />
        <Resource />
      </div>
    </div>
  );
}
