import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, MapPinIcon, ArrowUpRightIcon, PlusIcon, FolderOpenIcon } from "lucide-react";

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;

  for (const r of rsvps) {
    if (r.status === "going") goingCount += 1;
    else if (r.status === "maybe") maybeCount += 1;
    else if (r.status === "not_going") notGoingCount += 1;
  }

  return { goingCount, maybeCount, notGoingCount };
}

export async function DashboardContent({ userId }: { userId: string }) {
  const rows = await prisma.event.findMany({
    where: { ownerUserId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      eventDate: true,
      location: true,
      rsvps: { select: { status: true } },
    },
  });

  const events = rows.map((e) => ({
    id: e.id,
    title: e.title,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
    location: e.location,
    ...countByStatus(e.rsvps),
  }));

  return (
    // 'w-full max-w-full h-auto' keeps the canvas clean and stops vertical flex layout stretching
    <div className="w-full max-w-full h-auto space-y-6 sm:space-y-8 py-2 sm:py-4 block">
      
      {/* Header section - optimized with adaptive widths for small devices */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/40 pb-6 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Your Events
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track attendee responses and manage invite links in real-time.
          </p>
        </div>

        {/* Button becomes fluid full-width on mobile to form an easy-to-tap target */}
        <Button 
          asChild 
          className="w-full sm:w-auto justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.02] px-5 py-4 sm:py-5 rounded-xl cursor-pointer"
        >
          <Link href={"/events/new"} className="flex items-center gap-1.5 justify-center">
            <PlusIcon className="w-4 h-4" /> Create event
          </Link>
        </Button>
      </div>

      {/* Grid rendering layouts */}
      {events.length === 0 ? (
        <Card className="w-full border-dashed border-zinc-800 bg-zinc-900/10 backdrop-blur-xs py-12 text-center rounded-2xl">
          <CardHeader className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6">
            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-muted-foreground/60 mb-2">
              <FolderOpenIcon className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-200">No events found</CardTitle>
            <CardDescription className="max-w-xs mx-auto text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
              Create your very first workspace event to start tracking real-time guest responses.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        // 'grid-cols-1 md:grid-cols-2' stops cards from squishing horizontally on mobile frames
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="w-full border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/40 hover:shadow-[0_4px_30px_rgba(139,92,246,0.03)] group rounded-2xl flex flex-col justify-between"
            >
              <CardHeader className="space-y-4 p-4 sm:p-6 w-full">
                <div className="flex items-start justify-between gap-4 w-full">
                  <CardTitle className="text-lg sm:text-xl font-bold text-zinc-100 group-hover:text-violet-400 transition-colors duration-300 leading-snug break-words max-w-[70%]">
                    {event.title}
                  </CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    asChild 
                    className="border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-violet-400 hover:border-violet-500/40 rounded-lg transition-all duration-200 shrink-0 cursor-pointer"
                  >
                    <Link href={`/events/${event.id}`} className="flex items-center gap-1">
                      Open <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
                
                {/* Structural meta text layout with text clipping safety parameters */}
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground/90 font-medium w-full">
                  <div className="flex items-center gap-2 w-full overflow-hidden">
                    <CalendarIcon className="w-4 h-4 text-violet-400/80 shrink-0" />
                    <span className="truncate">
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
                        : "No date selected"}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 w-full overflow-hidden">
                      <MapPinIcon className="w-4 h-4 text-fuchsia-400/80 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Color-coded RSVP Status Metric Indicators */}
                <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs pt-2 border-t border-zinc-800/40 w-full">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg px-2 sm:px-2.5 py-0.5 font-semibold">
                    Going: {event.goingCount}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/10 rounded-lg px-2 sm:px-2.5 py-0.5 font-semibold">
                    Maybe: {event.maybeCount}
                  </Badge>
                  <Badge variant="outline" className="bg-zinc-500/5 text-zinc-400 border border-zinc-800 hover:bg-zinc-500/5 rounded-lg px-2 sm:px-2.5 py-0.5 font-semibold">
                    Not Going: {event.notGoingCount}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
