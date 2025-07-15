// src/pages/Home.tsx
import { useEffect, useState } from "react";
import API from "../api";
import EventCard from "../Components/EventCard";
import type { Event } from "../types";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    API.get("/events").then((res) => setEvents(res.data));
  }, []);

  return (
    <div>
      <div className="p-4   grid gap-4 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
