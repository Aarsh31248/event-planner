import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";
import { CalendarIcon, MapPinIcon, FileTextIcon, HeadingIcon, ArrowLeftIcon } from "lucide-react";

export default async function NewEventPage() {
  return (
    // Uses standard auto margins and clears height overrides to fit perfectly on one screen without scrolling
    <div className="mx-auto w-full max-w-2xl px-1 py-4 space-y-4 h-auto block">
      
      {/* Back to workspace link */}
      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-violet-400 transition-colors duration-200 group w-fit"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Frosted card container matching the rest of the application */}
      <Card className="w-full border-zinc-800/60 bg-zinc-900/20 backdrop-blur-xs rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] h-auto overflow-hidden">
        <CardHeader className="border-b border-zinc-800/40 p-5 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Create Event
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
            Configure your workspace details below to generate real-time guest RSVP tokens.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-5 sm:p-6">
          <Form action={createEventAction} className="space-y-5 h-auto w-full">
            
            {/* Title Block */}
            <FormField className="space-y-1.5 w-full block">
              <Label htmlFor="title" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <HeadingIcon className="w-3.5 h-3.5 text-violet-400/80" /> Title
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Team dinner..."
                className="w-full bg-zinc-950/40 border-zinc-800 focus-visible:ring-violet-500/50 rounded-xl h-10 px-3.5 placeholder:text-zinc-600 text-zinc-100 text-sm transition-all duration-200"
              />
            </FormField>

            {/* Description Block */}
            <FormField className="space-y-1.5 w-full block">
              <Label htmlFor="description" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <FileTextIcon className="w-3.5 h-3.5 text-violet-400/80" /> Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Optional details about the event context..."
                className="w-full bg-zinc-950/40 border-zinc-800 focus-visible:ring-violet-500/50 rounded-xl min-h-[90px] h-[90px] p-3.5 placeholder:text-zinc-600 text-zinc-100 text-sm leading-relaxed transition-all duration-200 resize-none"
              />
            </FormField>

            {/* Parameters Row - Grid on desktop, stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Location Block */}
              <FormField className="space-y-1.5 w-full block">
                <Label htmlFor="location" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 text-fuchsia-400/80" /> Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Optional location or link"
                  className="w-full bg-zinc-950/40 border-zinc-800 focus-visible:ring-violet-500/50 rounded-xl h-10 px-3.5 placeholder:text-zinc-600 text-zinc-100 text-sm transition-all duration-200"
                />
              </FormField>

              {/* Date & Time Picker */}
              <FormField className="space-y-1.5 w-full block">
                <Label htmlFor="eventDate" className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-fuchsia-400/80" /> Date and time
                </Label>
                <Input 
                  id="eventDate" 
                  name="eventDate" 
                  type="datetime-local" 
                  className="w-full bg-zinc-950/40 border-zinc-800 focus-visible:ring-violet-500/50 rounded-xl h-10 px-3.5 text-zinc-100 text-sm transition-all duration-200 [color-scheme:dark]"
                />
                <FormMessage className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/50 pl-1 mt-0.5 block">
                  Optional, you can set this later.
                </FormMessage>
              </FormField>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-800/40 w-full">
              <Button 
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-none bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] px-5 h-10 text-sm rounded-xl cursor-pointer justify-center"
              >
                Create event
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                asChild
                className="w-full sm:w-auto border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 hover:text-zinc-100 rounded-xl h-10 px-5 text-sm transition-all duration-200 cursor-pointer justify-center"
              >
                <Link href={"/dashboard"}>Cancel</Link>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
