import "../globals.css";
import Navigation from "../components/Navigation"
export default function HomeLayout({ children }) {
  return (
      <div className="app">
       <Navigation/>
        {children}
      </div>
  );
}
