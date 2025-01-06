import Navigation from "../components/Navigation";
export default function VoteLayout({ children }) {
  return (
    <div className="app">
      <Navigation/>
      {children}
    </div>
  );
}