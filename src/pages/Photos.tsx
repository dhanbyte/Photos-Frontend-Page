// src/pages/Photos.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import PhotoGrid from "../Components/PhotoGrid";

type Photo = {
  imageUrl: string;
  uploadedAt: string;
};

export default function Photos() {
  const { eventId, stateId } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId || !stateId) return;
    
    API.get(`/events/${eventId}/states/${stateId}/photos`)
      .then((res) => setPhotos(res.data))
      .catch((err) => console.error("Error fetching photos:", err))
      .finally(() => setLoading(false));
  }, [eventId, stateId]);

  if (loading) return <p className="p-4">Loading photos...</p>;
  if (!photos.length) return <p className="p-4">No photos found.</p>;

  return (
    <div className="p-4">
      <PhotoGrid photos={photos} />
    </div>
  );
}
