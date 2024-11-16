import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Resource() {
  return (
    <Card className="hover:shadow-md cursor-pointer">
      <CardHeader>
        <CardTitle>Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Vehicle is our main resource</CardDescription>
        <p className="mt-4">
          <span className="font-semibold text-3xl">5</span>{" "}
          <span className="text-lg text-gray-700">Attributes</span>
        </p>
      </CardContent>
    </Card>
  );
}
