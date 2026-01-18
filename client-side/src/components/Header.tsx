import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BookOpen } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/options', label: 'Strategy Builder', icon: TrendingUp },
    { path: '/tutorial', label: 'Tutorial', icon: BookOpen },
  ];

  return (
    <header className="glass-card mb-6">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">Options Lab</span>
        </div>
        
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
