"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000, bookings: 45 },
  { month: "Feb", revenue: 15000, bookings: 52 },
  { month: "Mar", revenue: 18000, bookings: 61 },
  { month: "Apr", revenue: 22000, bookings: 73 },
  { month: "May", revenue: 25000, bookings: 84 },
  { month: "Jun", revenue: 28000, bookings: 92 },
];

// const tourData = [
//   { month: "Jan", tours: 12, guests: 180 },
//   { month: "Feb", tours: 15, guests: 225 },
//   { month: "Mar", tours: 18, guests: 270 },
//   { month: "Apr", tours: 22, guests: 330 },
//   { month: "May", tours: 25, guests: 375 },
//   { month: "Jun", tours: 28, guests: 420 },
// ];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-2))",
  },
  tours: {
    label: "Tours",
    color: "hsl(var(--chart-3))",
  },
  guests: {
    label: "Guests",
    color: "hsl(var(--chart-4))",
  },
};

export default function DashboardCharts() {
  return (
    <>
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and booking trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke={chartConfig.revenue.color}
                  fill={chartConfig.revenue.color}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stackId="1"
                  stroke={chartConfig.bookings.color}
                  fill={chartConfig.bookings.color}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
