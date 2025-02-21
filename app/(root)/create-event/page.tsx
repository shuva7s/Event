import EventForm from "@/components/app_components/forms/EventForm";

const CreateEventPage = () => {
  return (
    <main className="wrapper min-h-[85vh]">
      <h1 className="h_xl mt-5 mb-10">Create <span className="text-primary">event</span></h1>
      <EventForm type="create" />
    </main>
  );
};

export default CreateEventPage;
