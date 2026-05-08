"use client";

import { useState } from 'react';
import Link from 'next/link';

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  current?: boolean;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', current: true },
    { name: 'Users', href: '/dashboard/users', icon: 'users' },
    { name: 'Orders', href: '/dashboard/orders', icon: 'orders' },
    { name: 'Complaints', href: '/dashboard/complaints', icon: 'complaints' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'orders':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'complaints':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'analytics':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">

        {/* Animated Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '6s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Layout Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 glass backdrop-blur-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-white/20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">LogisticsBot</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-6 px-3 pb-20">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.current
                      ? 'bg-white/20 text-white border-l-4 border-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className={`
                    mr-3 flex-shrink-0
                    ${item.current ? 'text-white' : 'text-white/60 group-hover:text-white/80'}
                  `}>
                    {getIcon(item.icon)}
                  </div>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-white/70 truncate">admin@logisticsbot.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Navigation */}
          <header className="glass backdrop-blur-lg border-b border-white/20">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-white/80 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-white">Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-white/80 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="relative">
                    <button className="flex items-center space-x-2 text-sm text-white/80 hover:text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">A</span>
                      </div>
                      <span className="hidden md:block font-medium">Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass rounded-xl shadow-2xl p-6 border border-white/20 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-2">2,543</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl shadow-2xl p-6 border border-white/20 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Active Orders</p>
                    <p className="text-3xl font-bold text-white mt-2">1,234</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl shadow-2xl p-6 border border-white/20 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Complaints</p>
                    <p className="text-3xl font-bold text-white mt-2">47</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl shadow-2xl p-6 border border-white/20 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Revenue</p>
                    <p className="text-3xl font-bold text-white mt-2">$45,678</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="glass rounded-xl shadow-2xl p-6 border border-white/20 backdrop-blur-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/20">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="px-4 py-3 text-sm text-white">#12345</td>
                        <td className="px-4 py-3 text-sm text-white">John Doe</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/30 text-green-100 rounded-full backdrop-blur-sm">Delivered</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">$156.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-white">#12346</td>
                        <td className="px-4 py-3 text-sm text-white">Jane Smith</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-500/30 text-yellow-100 rounded-full backdrop-blur-sm">In Transit</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">$234.50</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-white">#12347</td>
                        <td className="px-4 py-3 text-sm text-white">Bob Johnson</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-500/30 text-blue-100 rounded-full backdrop-blur-sm">Processing</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">$89.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Complaints */}
              <div className="glass rounded-xl shadow-2xl p-6 border border-white/20 backdrop-blur-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Complaints</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-400 pl-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Delivery Delay</p>
                      <span className="text-xs text-white/70">2 hours ago</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1">Order #12345 is delayed by 2 days</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-red-500/30 text-red-100 rounded-full backdrop-blur-sm">High</span>
                      <span className="text-xs text-white/70">By: John Doe</span>
                    </div>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Damaged Package</p>
                      <span className="text-xs text-white/70">5 hours ago</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1">Package arrived in damaged condition</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-500/30 text-yellow-100 rounded-full backdrop-blur-sm">Medium</span>
                      <span className="text-xs text-white/70">By: Jane Smith</span>
                    </div>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Wrong Item</p>
                      <span className="text-xs text-white/70">1 day ago</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1">Received wrong item in order</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-500/30 text-green-100 rounded-full backdrop-blur-sm">Low</span>
                      <span className="text-xs text-white/70">By: Bob Johnson</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
      );
    
}
