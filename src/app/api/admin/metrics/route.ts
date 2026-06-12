import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized administrative access." }, { status: 401 });
    }

    const data = await req.json();

    // Map metrics and parse numeric values
    const updated = await prisma.systemMetric.update({
      where: { id: "metrics" },
      data: {
        studentsReached: Math.max(0, parseInt(data.studentsReached) || 0),
        volunteersEngaged: Math.max(0, parseInt(data.volunteersEngaged) || 0),
        serviceHours: Math.max(0, parseInt(data.serviceHours) || 0),
        communityProjects: Math.max(0, parseInt(data.communityProjects) || 0),
        eventsHosted: Math.max(0, parseInt(data.eventsHosted) || 0),
        mentors: Math.max(0, parseInt(data.mentors) || 0),
        resourcesDistributed: Math.max(0, parseInt(data.resourcesDistributed) || 0),
        partnerships: Math.max(0, parseInt(data.partnerships) || 0)
      }
    });

    return NextResponse.json({ success: true, metrics: updated });
  } catch (error) {
    console.error("Metrics update error", error);
    return NextResponse.json({ success: false, error: "Database update failure." }, { status: 500 });
  }
}
