import Navigation from "../components/Navigation";
export default function PostsLayout({ children }) {
  return (
    <div>
      <Navigation/>
      {children}
    </div>
  );
}