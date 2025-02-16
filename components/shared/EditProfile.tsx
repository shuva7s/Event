import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const EditProfile = ({ className }: { className?: string }) => {
  return (
    <Button size="icon" variant="outline" className={cn(className)}>
      <Pencil />
    </Button>
  );
};

export default EditProfile;
