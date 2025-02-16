import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <main className="w-full wrapper min-h-[80vh] fl_center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </main>
  );
};

export default Loading;
