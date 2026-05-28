import Link from 'next/link';
import {
  Film,
  Users,
  BarChart3,
  Settings,
  Tv,
  Tag,
  Image,
  CreditCard,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard/content', label: 'Content', icon: Film, count: '248' },
  { href: '/dashboard/series', label: 'Series', icon: Tv, count: '52' },
  { href: '/dashboard/users', label: 'Users', icon: Users, count: '15.2K' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/genres', label: 'Genres', icon: Tag, count: '24' },
  { href: '/dashboard/banners', label: 'Banners', icon: Image, count: '8' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function AdminHome() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">StreamVault Admin</h1>
          <p className="text-muted-foreground mt-2">Content Management Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '15,247', change: '+12%' },
            { label: 'Active Subs', value: '3,891', change: '+8%' },
            { label: 'Total Content', value: '248', change: '+5' },
            { label: 'Revenue', value: '$24.5K', change: '+18%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg p-5 border border-border">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-green-400 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-card hover:bg-secondary rounded-lg p-5 border border-border transition-colors"
            >
              <div className="p-3 bg-primary/10 rounded-lg">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.label}</h3>
                {item.count && (
                  <p className="text-sm text-muted-foreground">{item.count} items</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
