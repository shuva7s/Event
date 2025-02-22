import { boolean, date, object, string } from "zod";

export const eventFormSchema = object({
  title: string()
    .min(1, "Title is required")
    .max(120, "Title must be less than 120 characters"),
  description: string()
    .min(1, "Description is required")
    .max(650, "Description must be less than 650 characters"),
  location: string(),
  image: string(),
  isOnline: boolean(),
  isPublic: boolean(),
  startDateTime: date({ required_error: "Start date time is required" }),
  endDateTime: date({ required_error: "End date time is required" }),
  url: string(),
})
  .refine((data) => data.endDateTime > data.startDateTime, {
    message: "End date time must be after start date time",
    path: ["endDateTime"],
  })
