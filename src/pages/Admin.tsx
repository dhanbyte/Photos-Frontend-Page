import { useEffect, useState } from "react";
import API from "../api";
import type { Event, State, Photo } from "../types";

export default function Admin() {
  const [tab, setTab] = useState("photo");
  const [events, setEvents] = useState<Event[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventMessage, setEventMessage] = useState("");
  const [eventError, setEventError] = useState("");

  const [editingEventId, setEditingEventId] = useState("");
  const [editEventName, setEditEventName] = useState("");
  const [editEventImage, setEditEventImage] = useState<File | null>(null);

  const [stateName, setStateName] = useState("");
  const [editingStateId, setEditingStateId] = useState("");
  const [stateMessage, setStateMessage] = useState("");
  const [stateError, setStateError] = useState("");

  const [photoImages, setPhotoImages] = useState<File[]>([]);
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    API.get("/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error loading events:", err));
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    API.get(`/states?eventId=${selectedEvent}`)
      .then(res => setStates(res.data))
      .catch(err => console.error("Error loading states:", err));
    API.get(`/photos?eventId=${selectedEvent}`)
      .then(res => setPhotos(res.data))
      .catch(err => console.error("Error loading photos:", err));
  }, [selectedEvent]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/upload", formData);
    return res.data.url;
  };

  const handleEventUpload = async () => {
    if (!eventImage || !eventName) {
      setEventError("Event name or image missing.");
      setEventMessage("");
      return;
    }
    try {
      const imageUrl = await uploadFile(eventImage);
      await API.post("/events", {
        name: eventName,
        coverImage: imageUrl,
        date: new Date().toISOString(),
      });
      setEventMessage("✅ Event uploaded successfully!");
      setEventError("");
      setEventName("");
      setEventImage(null);

      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error uploading event:", err);
      setEventError("❌ Failed to upload event.");
      setEventMessage("");
    }
  };

  const updateEvent = async () => {
    if (!editingEventId || !editEventName) return;
    try {
      let imageUrl;
      if (editEventImage) {
        imageUrl = await uploadFile(editEventImage);
      }
      await API.put(`/events/${editingEventId}`, {
        name: editEventName,
        ...(imageUrl && { coverImage: imageUrl }),
      });
      const res = await API.get("/events");
      setEvents(res.data);
      setEditingEventId("");
      setEditEventName("");
      setEditEventImage(null);
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await API.delete(`/events/${eventId}`);
      setEvents(events.filter((e) => e._id !== eventId));
      setStates([]);
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const updateState = async () => {
    if (!editingStateId || !stateName) return;
    try {
      await API.put(`/states/${editingStateId}`, { name: stateName });
      const res = await API.get(`/states?eventId=${selectedEvent}`);
      setStates(res.data);
      setEditingStateId("");
      setStateName("");
    } catch (err) {
      console.error("Update state failed:", err);
    }
  };

  const deleteState = async (stateId: string) => {
    try {
      await API.delete(`/states/${stateId}`);
      setStates(states.filter((s) => s._id !== stateId));
    } catch (err) {
      console.error("Delete state failed:", err);
    }
  };

  const handleStateUpload = async () => {
    if (!stateName || !selectedEvent) {
      setStateError("Missing data.");
      setStateMessage("");
      return;
    }
    try {
      await API.post("/states", {
        eventId: selectedEvent,
        name: stateName,
      });
      setStateMessage("✅ State uploaded successfully!");
      setStateError("");
      setStateName("");

      const res = await API.get(`/states?eventId=${selectedEvent}`);
      setStates(res.data);
    } catch (err) {
      console.error("Error uploading state:", err);
      setStateError("❌ Failed to upload state.");
      setStateMessage("");
    }
  };

  const handlePhotoUpload = async () => {
    if (photoImages.length === 0 || !selectedEvent || !selectedState) {
      setPhotoError("Missing fields");
      setPhotoMessage("");
      return;
    }
    try {
      const uploaded = await Promise.all(
        photoImages.map(async (image) => {
          const imageUrl = await uploadFile(image);
          const date = new Date().toISOString().split("T")[0];
          const res = await API.post("/photos", {
            eventId: selectedEvent,
            state: selectedState,
            url: imageUrl,
            date,
          });
          return res.data;
        })
      );
      setPhotos(uploaded);
      setPhotoMessage("✅ All photos uploaded successfully!");
      setPhotoError("");
      setPhotoImages([]);
    } catch (err) {
      console.error("Error uploading photos:", err);
      setPhotoError("❌ Failed to upload one or more photos.");
      setPhotoMessage("");
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await API.delete(`/photos/${photoId}`);
      setPhotos((prev) => prev.filter((p) => p._id !== photoId));
    } catch (err) {
      console.error("Delete photo failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
      <div className="flex justify-around space-x-2">
        <button onClick={() => setTab("photo")} className={`px-4 py-2 rounded ${tab === "photo" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>Upload Photo</button>
        <button onClick={() => setTab("event")} className={`px-4 py-2 rounded ${tab === "event" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Upload Event</button>
        <button onClick={() => setTab("state")} className={`px-4 py-2 rounded ${tab === "state" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Upload State</button>
      </div>

      {tab === "event" && (
        <div className="space-y-4">
          <div className="border p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold">📅 Upload Event</h2>
            <input type="text" placeholder="Event Name" className="w-full border rounded p-2" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setEventImage(e.target.files?.[0] || null)} />
            <button onClick={handleEventUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload Event</button>
            {eventMessage && <div className="text-green-600">{eventMessage}</div>}
            {eventError && <div className="text-red-600">{eventError}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div key={event._id} className="border p-3 rounded shadow space-y-2">
                {editingEventId === event._id ? (
                  <>
                    <input value={editEventName} onChange={(e) => setEditEventName(e.target.value)} className="w-full border p-2 rounded" />
                    <input type="file" accept="image/*" onChange={(e) => setEditEventImage(e.target.files?.[0] || null)} />
                    <div className="flex gap-2">
                      <button onClick={updateEvent} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                      <button onClick={() => { setEditingEventId(""); setEditEventName(""); setEditEventImage(null); }} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <img src={event.coverImage} className="h-32 w-full object-cover rounded" alt="event" />
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingEventId(event._id); setEditEventName(event.name); }} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => deleteEvent(event._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "state" && (
        <div className="space-y-4 border p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold">📍 Manage State</h2>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Select Event</option>
            {events.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
          <input type="text" placeholder="State Name" className="w-full border rounded p-2" value={stateName} onChange={(e) => setStateName(e.target.value)} />
          <button onClick={handleStateUpload} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Upload State</button>
          {stateMessage && <div className="text-green-600">{stateMessage}</div>}
          {stateError && <div className="text-red-600">{stateError}</div>}

          <div className="space-y-2 mt-4">
            {states.map((s) => (
              <div key={s._id} className="flex gap-2 items-center border p-2 rounded">
                {editingStateId === s._id ? (
                  <>
                    <input value={stateName} onChange={(e) => setStateName(e.target.value)} className="flex-1 border rounded p-1" />
                    <button onClick={updateState} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={() => { setEditingStateId(""); setStateName(""); }} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{s.name}</span>
                    <button onClick={() => { setEditingStateId(s._id); setStateName(s.name); }} className="bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => deleteState(s._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "photo" && (
        <div className="space-y-3 border p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold">🖼️ Upload Photo</h2>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="w-full border rounded p-2">
            <option value="">Select Event</option>
            {events.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full border rounded p-2">
            <option value="">Select State</option>
            {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <input type="file" multiple accept="image/*" onChange={(e) => setPhotoImages(Array.from(e.target.files || []))} />
          <button onClick={handlePhotoUpload} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Upload Photo(s)</button>
          {photoMessage && <div className="text-green-600">{photoMessage}</div>}
          {photoError && <div className="text-red-600">{photoError}</div>}

          {photos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">🖼️ Last Uploaded Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((p) => (
                  <div key={p._id} className="border rounded p-2 space-y-2">
                    <img src={p.url} alt="Uploaded" className="w-full h-40 object-cover rounded" />
                    <div className="text-sm text-gray-600">{p.date}</div>
                    <button onClick={() => deletePhoto(p._id)} className="bg-red-600 text-white px-2 py-1 text-sm rounded">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
