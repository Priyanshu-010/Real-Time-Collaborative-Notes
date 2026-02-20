import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { inviteCollaborator, acceptInvite } from "../api/note.api.js";
import { getNoteById } from "../api/note.api.js";
import axiosInstance from "../api/axios.js";

const SOCKET_URL = "http://localhost:3000";

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
    } catch (error) {
      console.log("Error in fetchNote NotePage: ", error)
      toast.error("Failed to fetch note");
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const { data } = await axiosInstance.get(`/versions/${id}`);
      setVersions(data);
    } catch {
      toast.error("Failed to fetch versions");
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await getNoteById(id);
        setNote(data);
        setContent(data.content);
        setLoading(false);
      } catch (error) {
        console.log("Error in useEffect fetchNote NotePage: ", error)
        toast.error("Failed to fetch note");
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  // Socket Connection
  useEffect(() => {
    if (!note) return;

    
    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });
    socketRef.current = socket;

    socket.emit("join-note", { noteId: id });

    socket.on("receive-update", ({ content: newContent, userId }) => {
      if (userId !== currentUserId) {
        setContent(newContent);
      }
    });

    socket.on("user-typing", (userName) => {
      setTypingUser(userName);
    });

    socket.on("user-stop-typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.emit("leave-note", { noteId: id });
      socket.disconnect();
    };
  }, [note, currentUserId, id, token]);

  if (loading)
    return <div className="text-white mt-20 text-center">Loading...</div>;
  if (!note)
    return <div className="text-white mt-20 text-center">Note not found</div>;

  const isOwner =
    note.owner?._id === currentUserId || note.owner === currentUserId;

  const collaborator = note.collaborators?.find(
    (c) => (c.user._id || c.user) === currentUserId,
  );

  const isPending = collaborator?.status === "pending";

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

      setTimeout(() => {
        socketRef.current.emit("stop-typing", { noteId: id });
      }, 1000);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await inviteCollaborator(id, { email, permission });
      toast.success("Invitation sent");
      setEmail("");
      setPermission("read");
      setShowInvite(false);
      fetchNote();
    } catch {
      toast.error("Failed to invite");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptInvite(id);
      toast.success("Invitation accepted");
      fetchNote();
    } catch {
      toast.error("Failed to accept invite");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

      {isPending && (
        <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded mb-6 flex justify-between items-center">
          <span>You have been invited to collaborate.</span>
          <button
            onClick={handleAccept}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Accept Invitation
          </button>
        </div>
      )}

      {isOwner && (
        <div className="mb-6">
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Invite Collaborator
          </button>

          {showInvite && (
            <form
              onSubmit={handleInvite}
              className="mt-4 bg-gray-900 p-4 rounded"
            >
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-2 mb-3 rounded bg-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                className="w-full p-2 mb-3 rounded bg-gray-800"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="read">Read</option>
                <option value="edit">Edit</option>
              </select>

              <button className="bg-purple-600 px-4 py-2 rounded">
                Send Invite
              </button>
            </form>
          )}
        </div>
      )}

      {/* 🔥 REAL-TIME EDITOR */}
      <textarea
        value={content}
        onChange={handleContentChange}
        disabled={!canEdit}
        className="w-full bg-gray-900 p-6 rounded mb-2 min-h-50"
      />

      {!canEdit && (
        <p className="text-red-400 mb-4">You only have read permission.</p>
      )}

      {typingUser && (
        <p className="text-gray-400 mb-4">{typingUser} is typing...</p>
      )}

      {/* Version History */}
      <div>
        <button
          onClick={() => {
            setShowVersions(!showVersions);
            if (!showVersions) fetchVersions();
          }}
          className="bg-blue-600 px-4 py-2 rounded mb-4"
        >
          {showVersions ? "Hide Versions" : "Show Version History"}
        </button>

        {showVersions &&
          versions.map((v) => (
            <div key={v._id} className="bg-gray-800 p-4 rounded mb-3">
              <p className="text-sm text-gray-400">
                Edited by: {v.editedBy?.email}
              </p>
              <p className="text-sm text-gray-400">
                Version: {v.versionNumber}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(v.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotePage;
