import Navigation from "../components/Navigation";
export default function ChatLayout({ children }) {
  return (
    <div className="app">
      <Navigation/>
      {children}
    </div>
  );
}