import { Home, Plus, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
      isActive: location.pathname === "/dashboard"
    },
    {
      to: "/",
      icon: Plus,
      label: "Report",
      isActive: location.pathname === "/"
    },
    {
      to: "/profile",
      icon: User,
      label: "Profile",
      isActive: location.pathname === "/profile"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 rounded-lg min-w-[64px] transition-colors",
              item.isActive 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;