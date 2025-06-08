'use client';

import { Package, Users, Tag, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Tổng sản phẩm',
    value: '1,234',
    icon: Package,
    change: '+12%',
    color: 'bg-blue-500',
  },
  {
    title: 'Tổng người dùng',
    value: '5,678',
    icon: Users,
    change: '+8%',
    color: 'bg-green-500',
  },
  {
    title: 'Danh mục',
    value: '45',
    icon: Tag,
    change: '+3%',
    color: 'bg-purple-500',
  },
  {
    title: 'Thống kê',
    value: '$12,345',
    icon: TrendingUp,
    change: '+15%',
    color: 'bg-yellow-500',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-6 space-y-4">
            {/* Add your recent activity items here */}
            <p className="text-gray-600">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
} 