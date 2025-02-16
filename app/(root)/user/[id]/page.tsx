const page = ({ params }: { params: { id: string } }) => {
  return (
    <main className="wrapper">
      <h1 className="h_lg">User page</h1>
      <p>{params.id}</p>
    </main>
  );
};

export default page;
