import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/doctors", label: "Doctors" },
  { to: "/reports", label: "Reports" },
  { to: "/chat", label: "Chat" },
  { to: "/reminders", label: "Reminders" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 px-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--primary-variant))] shadow-[var(--shadow-glow)]" />
          <span className="font-semibold">RetinaCare AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground" : "text-foreground/60"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
