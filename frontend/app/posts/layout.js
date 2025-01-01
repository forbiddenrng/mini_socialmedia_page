import Navigation from "../components/Navigation";
export default function PostsLayout({ children }) {
  return (
    <div className="app">
      <Navigation/>
      {children}
    </div>
  );
}