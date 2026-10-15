import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

function ProfileLink({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/quiz")) return null;
  const onAccountPages = pathname === "/dashboard" || pathname === "/profile";
  return onAccountPages ? (
    <Link to="/profile" className="profile-btn">Profile</Link>
  ) : (
    <Link to="/dashboard" className="profile-btn">My Learning</Link>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    // Block body on purpose: an effect must not return anything except a cleanup function.
    window.scrollTo?.(0, 0);
  }, [pathname]);

  const cls = (active: boolean) => (active ? "active" : undefined);

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo">
          <span>F</span> FusionLearn
        </Link>
        <nav aria-label="Main">
          <Link to="/" className={cls(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>
            Home
          </Link>
          <Link to="/courses" className={cls(pathname.startsWith("/course"))} aria-current={pathname === "/courses" ? "page" : undefined}>
            Courses
          </Link>
          <Link to="/dashboard" className={cls(pathname === "/dashboard")} aria-current={pathname === "/dashboard" ? "page" : undefined}>
            Dashboard
          </Link>
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            id="themeBtn"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <ProfileLink pathname={pathname} />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="footer-content">
          <div>
            <h3>FusionLearn</h3>
            <p>Learn. Practice. Grow.</p>
          </div>
          <p>© 2026 FusionLearn</p>
        </div>
      </footer>
    </>
  );
}
