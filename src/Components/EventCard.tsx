// src/components/EventCard.tsx
import { Link } from "react-router-dom";
import type { Event } from "../types";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  return (
    <>
    
    <Link className="" to={`/events/${event._id}`}>
      <div className="p-4  w-80 h-32  shadow rounded-xl hover:shadow-md py-10 bg-gray-100 hover:bg-gray-200 text-center  hover:scale-105 duration-300">
        <h2 className="text-xl font-bold">{event.name}</h2>
      </div>
    </Link>
     </>
  );
}
