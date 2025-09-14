import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import data from "./data.json";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
