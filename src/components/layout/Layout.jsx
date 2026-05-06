import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <Sidebar />

     <div className="md:pl-60 w-full">
        <Navbar />

        <div className="pt-5 px-6 min-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}  

export default Layout;
