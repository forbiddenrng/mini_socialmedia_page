import Navigation from "../components/Navigation";
export default function PofileLayout({ children }) {
  return (
    <div className="app">
      <Navigation/>
      {children}
    </div>
  );
}