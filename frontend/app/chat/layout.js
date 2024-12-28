import Navigation from "../components/Navigation";
export default function ChatLayout({ children }) {
  return (
    <div>
      <Navigation/>
      {children}
    </div>
  );
}