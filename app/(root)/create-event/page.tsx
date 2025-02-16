import EventForm from "@/components/shared/forms/EventForm";

const CreateEventPage = () => {
  return (
    <main className="wrapper min-h-[85vh]">
      <h1 className="h_xl mb-4">Create <span className="text-primary">event</span></h1>
      <EventForm type="create" />
    </main>
  );
};

export default CreateEventPage;
