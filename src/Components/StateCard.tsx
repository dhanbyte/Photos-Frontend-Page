// src/components/StateCard.tsx
import { Link } from "react-router-dom";
import type { State } from "../types";

type Props = {
  state: State;
  eventId: string;
};

export default function StateCard({ state, eventId }: Props) {
  return (
    <Link
      to={`/events/${eventId}/states/${state._id}`}
      className="w-full max-w-sm mx-auto"
    >
      
      <div className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition duration-300 hover:bg-purple-50 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{state.name}</h3>
      </div>
    </Link>
  );
}
