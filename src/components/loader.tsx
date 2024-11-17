import { Loader2 } from "lucide-react";

function Loader({ message }: { message?: string }) {
  return (
    <div className="w-full flex gap-2 items-center">
      <Loader2 className="animate-spin" /> {message && <p className="text-gray-800">{message}</p>}
    </div>
  );
}

export default Loader;
