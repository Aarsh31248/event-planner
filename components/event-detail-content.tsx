import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form } from "./ui/form";
import { createInviteLinkAction } from "@/lib/actions/events";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  LinkIcon,
  UsersIcon,
  CheckCircle2Icon,
  HelpCircleIcon,
  XCircleIcon,
} from "lucide-react";

export async function EventDetailContent({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) {
  // Fetch event details safely from database
  const row = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      invite: { select: { token: true } },
      rsvps: { select: { status: true } },
    },
  });

  if (!row) {
    notFound();
  }

  const counts = countByStatus(row.rsvps);

  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    inviteToken: row.invite?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount,
  };

  // Fetch attendees list asynchronously
  const rsvpRows = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true,
    },
  });

  const rsvps = rsvpRows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    status: r.status,
    respondedAt: r.respondedAt.toISOString(),
  }));

  const createInviteActionForEvent = createInviteLinkAction.bind(
    null,
    event.id,
  );

  const inviteUrl = event.inviteToken
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}`
    : null;
  return (
    <div className="w-full max-w-full h-auto space-y-6 sm:space-y-8 py-2 sm:py-4 block">
      {/* Top Header Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/40 pb-6 w-full">
        <div className="space-y-3 max-w-2xl w-full">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-violet-400 transition-colors duration-200 group w-fit"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent break-words leading-tight">
            {event.title}
          </h1>

          <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground/90 font-medium">
            <div className="flex items-center gap-2 w-full overflow-hidden">
              <CalendarIcon className="w-4 h-4 text-violet-400/80 shrink-0" />
              <span className="truncate">
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
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

          {event.description && (
            <p className="text-xs sm:text-sm text-muted-foreground/70 leading-relaxed font-normal pt-1 break-words">
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Real-time RSVP Summary Metric Badges */}
      <div className="flex flex-wrap gap-2 text-xs w-full">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg px-2.5 py-0.5 font-semibold flex items-center gap-1.5">
          <CheckCircle2Icon className="w-3 h-3" /> Going: {event.goingCount}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/10 rounded-lg px-2.5 py-0.5 font-semibold flex items-center gap-1.5"
        >
          <HelpCircleIcon className="w-3 h-3" /> Maybe: {event.maybeCount}
        </Badge>
        <Badge
          variant="outline"
          className="bg-zinc-500/5 text-zinc-400 border border-zinc-800 hover:bg-zinc-500/5 rounded-lg px-2.5 py-0.5 font-semibold flex items-center gap-1.5"
        >
          <XCircleIcon className="w-3 h-3" /> Not Going: {event.notGoingCount}
        </Badge>
      </div>

      {/* Invite Generation Control Card */}
      <Card className="w-full border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs rounded-2xl">
        <CardHeader className="p-5 sm:p-6 pb-2">
          <CardTitle className="text-lg font-bold text-zinc-200 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-violet-400" /> Invite Link
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground/70 pt-0.5">
            Share this unique URL token with attendees so they can track or
            alter their responses instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-4 w-full">
          {inviteUrl ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-xs sm:text-sm text-zinc-300 font-mono select-all break-all max-w-full">
              {inviteUrl}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/5 p-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground/60 font-medium">
                No active secure link invitation active for this workspace yet.
              </p>
            </div>
          )}

          <Form action={createInviteActionForEvent}>
            <Button
              type="submit"
              className={`w-full sm:w-auto px-5 h-9 text-xs sm:text-sm rounded-xl cursor-pointer font-medium transition-all duration-300 ${
                inviteUrl
                  ? "border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.01]"
              }`}
            >
              {inviteUrl ? "Regenerate Invite Link" : "Generate Invite Link"}
            </Button>
          </Form>
        </CardContent>
      </Card>

      {/* Guest Response Tracker Table Card */}
      <Card className="w-full border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-800/40">
          <CardTitle className="text-lg font-bold text-zinc-200 flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-fuchsia-400" /> Attendees Ledger
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-4 w-full">
          {rsvps.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground/60 font-medium">
                Awaiting responses. Circulate an active invite link above to
                register visitors.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto min-w-full block scrollbar-thin">
              <Table className="w-full min-w-[500px] sm:min-w-full table-auto">
                <TableHeader className="bg-zinc-950/20 border-b border-zinc-800/40">
                  <TableRow className="hover:bg-transparent border-zinc-800/40">
                    <TableHead className="text-zinc-400 font-semibold h-11 px-4 text-xs sm:text-sm">
                      Name
                    </TableHead>
                    <TableHead className="text-zinc-400 font-semibold h-11 px-4 text-xs sm:text-sm">
                      Email
                    </TableHead>
                    <TableHead className="text-zinc-400 font-semibold h-11 px-4 text-xs sm:text-sm">
                      Status
                    </TableHead>
                    <TableHead className="text-zinc-400 font-semibold h-11 px-4 text-xs sm:text-sm text-right">
                      Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvps.map((rsvp, index) => (
                    <TableRow
                      key={index}
                      className="border-zinc-800/20 hover:bg-zinc-900/30 transition-colors duration-150"
                    >
                      <TableCell className="font-medium text-zinc-200 h-12 px-4 text-xs sm:text-sm">
                        {rsvp.name}
                      </TableCell>
                      <TableCell className="text-zinc-400 font-mono h-12 px-4 text-xs sm:text-sm">
                        {rsvp.email}
                      </TableCell>
                      <TableCell className="h-12 px-4">
                        <Badge
                          variant="secondary"
                          className={`rounded-lg px-2 py-0.5 text-[10px] sm:text-xs font-semibold ${
                            rsvp.status === "going"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                              : rsvp.status === "maybe"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                                : "bg-zinc-500/10 text-zinc-400 border border-zinc-800"
                          }`}
                        >
                          {rsvp.status === "not_going"
                            ? "Not Going"
                            : rsvp.status.charAt(0).toUpperCase() +
                              rsvp.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500 font-medium text-right h-12 px-4 text-xs sm:text-sm">
                        {new Date(rsvp.respondedAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
