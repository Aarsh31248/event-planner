import { Button } from "./ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { notFound } from "next/navigation";
import { Form, FormField } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";
import { CalendarIcon, MapPinIcon, CheckCircle2Icon, UserIcon, MailIcon, InfoIcon } from "lucide-react";

export async function InviteRsvpContent({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) {
  const row = await prisma.eventInvite.findFirst({
    where: { token },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          eventDate: true,
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const e = row.event;
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

  return (
    // 'w-full max-w-2xl px-1 h-auto block' protects against any vertical stretching or page overflows
    <div className="mx-auto w-full max-w-2xl px-1 py-4 sm:py-8 h-auto block">
      <Card className="w-full border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] h-auto overflow-hidden">
        
        {/* Header Block */}
        <CardHeader className="space-y-4 p-5 sm:p-6 border-b border-zinc-800/40">
          <Badge 
            variant="secondary" 
            className="w-fit border border-violet-500/20 bg-violet-500/10 text-violet-300 font-semibold tracking-wide px-2.5 py-0.5 text-xs rounded-lg"
          >
            Invitation
          </Badge>
          
          <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent break-words leading-tight">
            {event.title}
          </CardTitle>
          
          {/* Metadata Display Rows */}
          <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground/90 font-medium w-full">
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
          
          {event.description && (
            <p className="text-xs sm:text-sm text-muted-foreground/70 leading-relaxed font-normal pt-1 break-words border-t border-zinc-800/20 pt-3">
              {event.description}
            </p>
          )}
        </CardHeader>
        
        {/* Content & Form Workspace */}
        <CardContent className="p-5 sm:p-6">
          {/* Enhanced Success Notification Alert */}
          {submitted && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs sm:text-sm text-emerald-400/90 font-medium shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <CheckCircle2Icon className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              <p className="leading-relaxed">
                Thank you! Your attendance preference has been logged successfully and synced with the event planner.
              </p>
            </div>
          )}

          <Form action={submitRsvpForToken} className="space-y-5 h-auto w-full">
            {/* Guest Name Block */}
            <FormField className="space-y-1.5 w-full block">
              <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-violet-400/80" /> Full Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="w-full bg-zinc-950/40 border-zinc-800 focus-visible:ring-violet-500/50 rounded-xl h-10 px-3.5 placeholder:text-zinc-600 text-zinc-100 text-sm transition-all duration-200"
              />
            </FormField>

            {/* Guest Email Block */}
            <FormField className="space-y-1.5 w-full block">
              <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <MailIcon className="w-3.5 h-3.5 text-violet-400/80" /> Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-zinc-950/40 border-zinc-800 focus-visible:ring-violet-500/50 rounded-xl h-10 px-3.5 placeholder:text-zinc-600 text-zinc-100 text-sm transition-all duration-200"
              />
            </FormField>

            {/* Attendance Status Selector Block */}
            <FormField className="space-y-1.5 w-full block">
              <Label htmlFor="status" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <InfoIcon className="w-3.5 h-3.5 text-fuchsia-400/80" /> Will You Attend?
              </Label>
              <div className="relative w-full block">
                <select
                  id="status"
                  name="status"
                  required
                  defaultValue="going"
                  className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3.5 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all cursor-pointer [color-scheme:dark] appearance-none"
                >
                  <option value="going" className="bg-zinc-900 text-zinc-100">Going</option>
                  <option value="maybe" className="bg-zinc-900 text-zinc-100">Maybe</option>
                  <option value="not_going" className="bg-zinc-900 text-zinc-100">Not going</option>
                </select>
                {/* Custom chevron indicator to override native appearance settings elegantly */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://w3.org" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </FormField>

            {/* Glowing Action Submit Button */}
            <div className="pt-2 w-full block">
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] h-10 text-sm rounded-xl cursor-pointer justify-center"
              >
                Submit RSVP Response
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
