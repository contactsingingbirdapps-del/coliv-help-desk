import { Home, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Home className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">CoLiving Manager</h1>
              <p className="text-sm text-primary-foreground/80">Issue Reporting Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6" />
            <div className="text-right">
              <p className="text-sm font-medium">Welcome, Tenant</p>
              <p className="text-xs text-primary-foreground/70">Unit 2B</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;