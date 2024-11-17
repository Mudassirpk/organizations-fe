import { TResourceAttribute } from "types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";

type Props = {
  title: string;
  createdAt: string;
  attributes: TResourceAttribute[];
  id: number;
};

export default function Resource({ title, createdAt, attributes, id }: Props) {
  return (
    <Card className="hover:shadow-md cursor-pointer">
      <CardHeader>
        <CardTitle className="flex justify-between w-full items-center">
          <span>{title}</span>{" "}
          <Link to={`/resource/edit/${id}`}>
            <Edit className="hover:text-gray-700" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link to={`/resource/${id}`}>
          <CardDescription>
            Created At{" "}
            <span className="px-2 py-1 rounded">
              {new Date(createdAt).toDateString()}
            </span>
          </CardDescription>
          <p className="mt-4">
            <span className="font-semibold text-3xl">{attributes.length}</span>{" "}
            <span className="text-lg text-gray-700">Attributes</span>
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
