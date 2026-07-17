import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth/server";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="space-y-6 max-w-3xl">
        <Badge
          variant="secondary"
          className="w-fit border border-violet-500/20 bg-violet-500/10 text-violet-300 font-medium tracking-wide px-3 py-1 text-xs rounded-full"
        >
          Next.js 16 + Neon Auth + Neon Postgres
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
          Plan events and track{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            RSVPs fast
          </span>
        </h1>

        <p className="max-w-xl text-base sm:text-lg text-muted-foreground/80 leading-relaxed">
          Create events, share a unique invite link, and watch attendee status
          update in real-time with Going, Maybe, and Not going counts.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          {!session?.data?.user && (
            <Button
              asChild
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all duration-300 hover:scale-[1.02] px-6 py-5 rounded-xl cursor-pointer"
            >
              <Link href="/auth/sign-up">Create account</Link>
            </Button>
          )}

          {!session?.data?.user && (
            <Button
              variant="outline"
              asChild
              className="border-zinc-800 hover:border-violet-500/40 bg-zinc-900/20 hover:bg-violet-500/5 text-foreground font-medium transition-all duration-300 px-6 py-5 rounded-xl cursor-pointer"
            >
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}

          <Button
            variant={session?.data?.user ? "default" : "ghost"}
            asChild
            className={
              session?.data?.user
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all duration-300 hover:scale-[1.02] px-6 py-5 rounded-xl cursor-pointer"
                : "text-muted-foreground hover:text-violet-400 hover:bg-violet-500/5 font-medium transition-all duration-200 px-6 py-5 rounded-xl cursor-pointer"
            }
          >
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/40 group rounded-2xl">
          <CardHeader>
            <CardTitle className="group-hover:text-violet-400 transition-colors duration-300 text-lg font-bold">
              Create events
            </CardTitle>
            <CardDescription className="text-muted-foreground/70 pt-1">
              Set title, date, and details in seconds.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs transition-all duration-300 hover:border-fuchsia-500/30 hover:bg-zinc-900/40 group rounded-2xl">
          <CardHeader>
            <CardTitle className="group-hover:text-fuchsia-400 transition-colors duration-300 text-lg font-bold">
              Share invite links
            </CardTitle>
            <CardDescription className="text-muted-foreground/70 pt-1">
              Generate a unique event token per event.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs transition-all duration-300 hover:border-indigo-500/30 hover:bg-zinc-900/40 group rounded-2xl flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="group-hover:text-indigo-400 transition-colors duration-300 text-lg font-bold">
              Track attendance
            </CardTitle>
            <CardDescription className="text-muted-foreground/70 pt-1">
              See attendee list and response totals at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground/50 border-t border-zinc-800/50 pt-4 mt-2 font-medium">
            Going, Maybe, and Not going are always up-to-date.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
