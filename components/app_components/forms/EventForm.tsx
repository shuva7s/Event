"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { File_uploader } from "../File_uploader";
import { useEffect, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "@/components/ui/checkbox";
import { eventFormSchema } from "@/lib/form-schemas/event-form";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const EventForm = ({
  type,
  eventId,
  title = "",
  description = "",
  location = "",
  image = "",
  isOnline = true,
  isPublic = true,
  startDateTime,
  endDateTime,
  hasStarted,
  hasEnded,
  url,
}: {
  type: "create" | "update";
  eventId?: string;
  title?: string;
  description?: string;
  image?: string;
  isOnline?: boolean;
  isPublic?: boolean;
  location?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  hasStarted?: boolean;
  hasEnded?: boolean;
  url?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEndTimeManuallyChanged, setIsEndTimeManuallyChanged] =
    useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const router = useRouter();

  let buttonText = type === "create" ? "Create event" : "Update event";
  if (isUploading) buttonText = "Uploading...";
  else if (processing)
    buttonText = type === "create" ? "Creating..." : "Updating...";

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
      location: location || "",
      image: image || "",
      isOnline: isOnline || true,
      isPublic: isPublic || true,
      startDateTime: startDateTime || new Date(),
      endDateTime: endDateTime || new Date(Date.now() + 60 * 60 * 1000), // Default to 1 hour later
      url: url || "",
    },
  });

  const startDateTimeValue = form.watch("startDateTime");
  // const endDateTimeValue = form.watch("endDateTime");

  useEffect(() => {
    if (!isEndTimeManuallyChanged && startDateTimeValue) {
      form.setValue(
        "endDateTime",
        new Date(startDateTimeValue.getTime() + 60 * 60 * 1000)
      );
    }
  }, [startDateTimeValue, isEndTimeManuallyChanged, form]);

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    if (type === "create") {
      try {
        if (files.length > 0) {
          setIsUploading(true);
          setProcessing(true);
          const uploadedImages = await startUpload(files);
          if (!uploadedImages) {
            return;
          }
          values.image = uploadedImages[0].url;
        }
        const { success, error, id } = await createEvent(values);
        form.reset();
        if (success) {
          router.push(`/events/${id}`);
        }
        toast({
          title: success ? "Success" : error?.title,
          description: success ? "Event created successfully" : error?.message,
          variant: success ? "success" : "destructive",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
        setIsUploading(false);
      }
    } else {
      if (files.length > 0) {
        setIsUploading(true);
        setProcessing(true);
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) {
          setIsUploading(false);
          return;
        }

        values.image = uploadedImages[0].url;
        setIsUploading(false);
      }

      const { success, error } = await updateEvent({
        ...values,
        eventId: eventId!,
      });
      form.reset();
      toast({
        title: success ? "Success" : error?.title,
        description: success ? "Event updated successfully" : error?.message,
        variant: success ? "success" : "destructive",
      });
      router.back();
    }
  }
  isOnline = form.watch("isOnline");

  if (type === "update" && hasStarted && !hasEnded) {
    return (
      <section className="text-destructive">
        <h2 className="h_lg">Event has already started</h2>
        <p className="p_lg">Ongoing event cannot be updated.</p>
      </section>
    );
  }

  if (type === "update" && hasEnded && hasEnded) {
    return (
      <section className="text-destructive">
        <h2 className="h_lg">Event has already ended</h2>
        <p className="p_lg">
          Events that are ended or expired will be deleted automatically if not
          deleted manually.
        </p>
      </section>
    );
  }

  return (
    <section className="pb-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:items-start">
            {/* Image */}
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
                      disabled={isUploading || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start date time */}
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date time</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => {
                          field.onChange(date ?? new Date());
                          setIsEndTimeManuallyChanged(false); // Reset manual change tracking
                        }}
                        showTimeSelect
                        minDate={new Date()}
                        minTime={
                          field.value?.toDateString() ===
                          new Date().toDateString()
                            ? new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour later for today
                            : new Date(0, 0, 0, 0, 0) // Any time for future dates
                        }
                        maxTime={new Date(0, 0, 0, 23, 59)}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        wrapperClassName="bg-background w-full rounded-full"
                        className="bg-transparent rounded-full h-10 border px-2 py-3 w-full outline-none focus:border-primary text-muted-foreground"
                        popperClassName="rounded-xl overflow-hidden"
                        disabled={hasStarted}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End date time */}
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date time</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => {
                          field.onChange(date ?? new Date());
                          setIsEndTimeManuallyChanged(true); // Mark that user changed end time manually
                        }}
                        showTimeSelect
                        minDate={startDateTimeValue}
                        minTime={
                          new Date(
                            startDateTimeValue.getTime() + 60 * 60 * 1000
                          )
                        } // Always at least 1 hour later
                        maxTime={new Date(0, 0, 0, 23, 59)}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        wrapperClassName="bg-background w-full rounded-full"
                        className="bg-transparent h-10 border px-2 py-3 rounded-full w-full outline-none focus:border-primary text-muted-foreground"
                        popperClassName="rounded-xl overflow-hidden"
                        disabled={hasStarted}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public event */}
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-10">
                        <label
                          htmlFor="publicEvent"
                          className="whitespace-nowrap leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
                        >
                          Public event
                        </label>
                        <Checkbox
                          onCheckedChange={field.onChange}
                          checked={field.value}
                          id="publicEvent"
                          className="h-5 w-5 border-2 border-primary-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Online event */}
              <FormField
                control={form.control}
                name="isOnline"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center h-10">
                        <label
                          htmlFor="isOnline"
                          className="whitespace-nowrap w-full leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Online event
                        </label>
                        <Checkbox
                          onCheckedChange={field.onChange}
                          checked={field.value}
                          id="isOnline"
                          className="h-5 w-5 border-2 border-primary-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>
                        Location {isOnline ? "(Optional)" : "(Required)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          required={!isOnline}
                          placeholder={"Enter event location"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>
                        Meeting link {!isOnline ? "(Optional)" : "(Required)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          required={isOnline}
                          type="url"
                          placeholder={"Enter an online meetup link"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button
                className="w-full mt-2"
                type="submit"
                disabled={
                  isUploading ||
                  processing ||
                  form.formState.isSubmitting ||
                  !form.formState.isDirty
                }
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EventForm;
