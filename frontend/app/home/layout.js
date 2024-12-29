import "../globals.css";
import Navigation from "../components/Navigation"
export default function HomeLayout({ children }) {
  return (
    <html lang="en">
      <body>
       <Navigation/>
        {children}
      </body>
    </html>
  );
}
