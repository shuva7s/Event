import { Loader2 } from "lucide-react";

const SimpleLoader = () => {
  return (
    <div className="w-full fl_center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};

export default SimpleLoader;
