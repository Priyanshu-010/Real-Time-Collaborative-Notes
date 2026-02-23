import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import {
  inviteCollaborator,
  acceptInvite,
  getNoteById,
} from "../api/note.api.js";
import axiosInstance from "../api/axios.js";

const SOCKET_URL = "https://real-time-collaborative-notes-3p97.onrender.com";

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");
  const [showInvite, setShowInvite] = useState(false);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);

  const socketRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const currentUserId = currentUser?._id;

  const fetchNote = async () => {
    try {
      const { data } = await getNoteById(id);
      setNote(data);
      setContent(data.content);
      setLoading(false);
    } catch {
      toast.error("Failed to fetch note");
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const { data } = await axiosInstance.get(`/versions/${id}`);
      setVersions(data);
    } catch {
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await getNoteById(id);
        setNote(data);
        setContent(data.content);
        setLoading(false);
      } catch {
        toast.error("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  useEffect(() => {
    if (!note) return;
    const socket = io(SOCKET_URL? SOCKET_URL: "http://localhost:3000", { auth: { token } });
    socketRef.current = socket;
    socket.emit("join-note", { noteId: id });
    socket.on("receive-update", ({ content: newContent, userId }) => {
      if (userId !== currentUserId) setContent(newContent);
    });
    socket.on("user-typing", (userName) => setTypingUser(userName));
    socket.on("user-stop-typing", () => setTypingUser(null));
    return () => {
      socket.emit("leave-note", { noteId: id });
      socket.disconnect();
    };
  }, [note, currentUserId, id, token]);

  if (loading)
    return (
      <div className="text-center py-20 text-slate-500 text-xl">
        Entering workspace...
      </div>
    );
  if (!note)
    return (
      <div className="text-center py-20 text-red-400 text-xl">
        Note not found.
      </div>
    );

  const isOwner =
    note.owner?._id === currentUserId || note.owner === currentUserId;
  const collaborator = note.collaborators?.find(
    (c) => (c.user._id || c.user) === currentUserId,
  );
  const canEdit =
    isOwner ||
    (collaborator?.status === "accepted" &&
      collaborator?.permission === "edit");

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (canEdit && socketRef.current) {
      socketRef.current.emit("note-update", {
        noteId: id,
        content: newContent,
      });
      socketRef.current.emit("typing", {
        noteId: id,
        userName: currentUser?.name,
      });
      setTimeout(
        () => socketRef.current.emit("stop-typing", { noteId: id }),
        1000,
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-col gap-2 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-black text-white">{note.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-indigo-400 font-bold uppercase tracking-widest">
              {isOwner ? "Author" : "Guest Editor"}
            </span>
            {typingUser && (
              <span className="text-slate-500 italic">
                ● {typingUser} is typing...
              </span>
            )}
          </div>
        </div>

        {collaborator?.status === "pending" && (
          <div className="bg-indigo-600 p-6 rounded-2xl flex justify-between items-center shadow-xl shadow-indigo-600/20">
            <p className="font-bold text-white text-lg">
              You've been invited to this note!
            </p>
            <button
              onClick={async () => {
                await acceptInvite(id);
                fetchNote();
              }}
              className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-black"
            >
              Accept
            </button>
          </div>
        )}

        <textarea
          value={content}
          onChange={handleContentChange}
          disabled={!canEdit}
          className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-xl text-slate-200 min-h-150 outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-2xl transition-all resize-none leading-relaxed"
          placeholder="Start your collaborative session..."
        />
        {!canEdit && (
          <p className="text-red-400 font-semibold text-center mt-4">
            Read-only mode enabled.
          </p>
        )}
      </div>

      <div className="lg:col-span-4 space-y-6">
        {isOwner && <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="w-full bg-indigo-600 py-3 rounded-xl font-bold text-white shadow-lg"
          >
            Share with Team
          </button>
          {showInvite && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await inviteCollaborator(id, { email, permission });
                setEmail("");
                setShowInvite(false);
                fetchNote();
              }}
              className="space-y-4 animate-in fade-in zoom-in-95"
            >
              <input
                type="email"
                placeholder="Team member email..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <select
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-sm"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="read">View Only</option>
                <option value="edit">Can Edit</option>
              </select>
              <button className="w-full bg-slate-100 text-slate-950 py-2 rounded-xl font-bold text-sm">
                Send Invite
              </button>
            </form>
          )}

          <button
            onClick={() => {
              setShowVersions(!showVersions);
              if (!showVersions) fetchVersions();
            }}
            className="w-full bg-slate-800 py-3 rounded-xl font-bold text-slate-300 border border-slate-700"
          >
            Version History
          </button>
          {showVersions && (
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">
                Revision History
              </h3>
              <div className="space-y-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                {versions.length === 0 ? (
                  <p className="text-slate-600 text-sm italic p-4 text-center">
                    No previous versions found.
                  </p>
                ) : (
                  versions.map((v) => (
                    <div
                      key={v._id}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-black text-indigo-400">
                          VERSION {v.versionNumber}
                        </p>
                        <p className="text-[10px] text-slate-600 font-mono">
                          {new Date(v.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                        "{v.content}"
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-slate-400">
                          {v.editedBy?.name?.charAt(0) || "U"}
                        </div>
                        <p className="text-[10px] text-slate-500 italic">
                          Saved by {v.editedBy?.name || "Unknown User"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>}
      </div>
    </div>
  );
};

export default NotePage;
