"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

const dummyEnrollmentData = [
  {
    date: "2024-05-15",
    enrollments: 12,
  },
  {
    date: "2024-05-16",
    enrollments: 8,
  },
  {
    date: "2024-05-17",
    enrollments: 50,
  },
  {
    date: "2024-05-18",
    enrollments: 100,
  },
  {
    date: "2024-05-19",
    enrollments: 150,
  },
  {
    date: "2024-05-20",
    enrollments: 43,
  },
  {
    date: "2024-05-21",
    enrollments: 69,
  },
  {
    date: "2024-05-22",
    enrollments: 67,
  },
  {
    date: "2024-05-23",
    enrollments: 65,
  },
  {
    date: "2024-05-24",
    enrollments: 63,
  },
  {
    date: "2024-05-25",
    enrollments: 61,
  },
  {
    date: "2024-05-26",
    enrollments: 59,
  },
  {
    date: "2024-05-27",
    enrollments: 57,
  },
  {
    date: "2024-05-28",
    enrollments: 55,
  },
  {
    date: "2024-05-20",
    enrollments: 53,
  },
  {
    date: "2024-05-29",
    enrollments: 51,
  },
  {
    date: "2024-05-30",
    enrollments: 49,
  },
  {
    date: "2024-05-31",
    enrollments: 47,
  },
  {
    date: "2024-06-01",
    enrollments: 45,
  },
  {
    date: "2024-06-02",
    enrollments: 140,
  },
  {
    date: "2024-06-03",
    enrollments: 120,
  },
  {
    date: "2024-05-20",
    enrollments: 17,
  },
  {
    date: "2024-06-04",
    enrollments: 13,
  },
  {
    date: "2024-06-05",
    enrollments: 89,
  },
  {
    date: "2024-06-06",
    enrollments: 89,
  },
];

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  enrollmentStats: { date: string; enrollments: number }[];
}

export function ChartAreaInteractive({
  enrollmentStats,
}: ChartAreaInteractiveProps) {
  const totalEnrollments = React.useMemo(
    () => enrollmentStats.reduce((acc, curr) => acc + curr.enrollments, 0),
    [enrollmentStats]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days: {totalEnrollments}
          </span>
          <span className="@[540px]/card:hidden">Last 30 days: 1200</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={enrollmentStats}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            <Bar dataKey="enrollments" fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
