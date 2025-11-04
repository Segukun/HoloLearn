import { Outlet } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import "../../styles/components/layout.css";
import Hero from "../../components/layout/hero.jsx"

export default function Layout() {
  return (
    <>
      <div className="layout">
        <Header />
        <main className="main">
          <Outlet /> {/* aka ce renderisan las pages Home/Courses/Login ༼ つ ◕_◕ ༽つ */}
          <Hero/>
        </main>
        <Footer />
      </div>
    </>
  );
}
