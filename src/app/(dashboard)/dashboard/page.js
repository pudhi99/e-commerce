// src/app/dashboard/page.js

import { Card } from "@/components/ui/card"; // Importing Card component

export default function DashboardPage() {
  // Sample data - replace with real data
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    // ... more data
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold mt-2">$12,345</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">123</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-gray-500">
            Total Customers
          </h3>
          <p className="text-2xl font-bold mt-2">456</p>
        </Card>
      </div>
    </div>
  );
}
