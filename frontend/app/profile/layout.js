import Navigation from "../components/Navigation";
export default function PofileLayout({ children }) {
  return (
    <div>
      <Navigation/>
      {children}
    </div>
  );
}