import Navigation from "../components/Navigation";
export default function ChartsLayout({ children }) {
  return (
    <div className="app">
      <Navigation/>
      {children}
    </div>
  );
}