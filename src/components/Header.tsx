import { Building2, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  pendingCount: number;
}

export const Header = ({ pendingCount }: HeaderProps) => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CoLiving Manager</h1>
              <p className="text-sm text-muted-foreground">Report and track issues</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              {pendingCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};