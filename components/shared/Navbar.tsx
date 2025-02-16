import { ModeToggle } from "../theme/ModeToggle";

const Navbar = () => {
  return (
    <header className="wrapper">
      <nav className="w-full py-5 flex justify-between items-center">
        <p className="h_md">Evently</p>
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
