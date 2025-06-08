"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../css/style.css";
import { LayoutDashboard, Package, Users, Tag, Menu, X, LogOut } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/auth-slice";
import { useDispatch } from "react-redux";
const sidebarItems = [
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: Package,
  },
];

// Create a client
const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSignOut = () => {
    // Add your sign out logic here
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    router.push("/");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        {/* Mobile Sidebar Toggle */}
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 flex flex-col`}
        >
          <div className="p-6">
            <Link href="/">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={120}
                height={36}
              />
            </Link>
          </div>
          <nav className="mt-6 flex-grow">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive ? "bg-gray-100 border-r-4 border-blue-500" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-6 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`min-h-screen transition-all duration-200 ease-in-out ${
            isSidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
