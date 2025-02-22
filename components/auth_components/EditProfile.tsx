"use client";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { File_uploader } from "../app_components/File_uploader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  image: z.string(),
});

const EditProfile = ({
  className,
  image,
  name,
}: {
  className?: string;
  image: string;
  name: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      image: image,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setProcessing(true);

      // Upload new image only if there are new files
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) return;
        values.image = uploadedImages[0].url;
      }

      // Always update the user, whether the image changed or not
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image,
      });

      toast({
        title: error ? "Error" : "Success",
        description: error
          ? error.message || "Something went wrong"
          : "Profile updated successfully",
        variant: error ? "destructive" : "success",
      });

      if (!error) {
        router.refresh();
        form.reset(values); // Reset form with latest values
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          form.reset({ name, image });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          className={cn(className, "bg-primary/50")}
          disabled={processing}
        >
          {processing ? <Loader2 className="animate-spin" /> : <Pencil className="text-white" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. You can change your namea and
            photo
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="md:sticky top-10">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <File_uploader
                        onFieldChange={field.onChange}
                        imageUrl={field.value || ""}
                        setFiles={setFiles}
                        disabled={processing || form.formState.isSubmitting}
                        max_file_size_mb={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap flex-row gap-1 justify-end">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    disabled={
                      processing ||
                      form.formState.isSubmitting ||
                      !form.formState.isDirty
                    }
                    type="submit"
                  >
                    Update
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
