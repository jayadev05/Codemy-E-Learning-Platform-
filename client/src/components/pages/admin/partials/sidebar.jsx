import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Settings,
  Ticket
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "#",
      isActive: true
    },
    {
      title: "Instructors",
      icon: Users,
      href: "#"
    },
    {
      title: "Students",
      icon: GraduationCap,
      href: "#"
    },
    {
      title: "Billing",
      icon: CreditCard,
      href: "#"
    },
    {
      title: "Settings and profile",
      icon: Settings,
      href: "#"
    },
    {
      title: "Coupon management",
      icon: Ticket,
      href: "#"
    }
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex flex-col items-center gap-2 p-6">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-800">
          <img
            src="/api/placeholder/64/64"
            alt="Admin avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-200">Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              item.isActive 
                ? "bg-orange-600 text-white hover:bg-orange-700" 
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;