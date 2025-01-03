import Navigation from "../components/Navigation";
export default function CommunityLayout({ children }) {
  return (
    <div className="app">
      <Navigation/>
      {children}
    </div>
  );
}