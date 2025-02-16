export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full wrapper min-h-screen fl_center">
      {children}
      <div className="w-screen h-screen fixed z-[-1] gradient-div-light dark:gradient-div-dark pointer-events-none" />
    </main>
  );
}
