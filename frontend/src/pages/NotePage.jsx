import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { inviteCollaborator, acceptInvite } from "../api/note.api.js";
import { getNoteById } from "../api/note.api.js";
import axiosInstance from "../api/axios.js";

const NotePage = () => {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");

  const [showInvite, setShowInvite] = useState(false);

  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  // Fetch Note

  const fetchNote = async () => {
    try {
      const { data } = await getNoteById(id);
      setNote(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch note");
      setLoading(false);
    }
  };

  // Fetch Versions
  const fetchVersions = async () => {
    try {
      const { data } = await axiosInstance.get(`/versions/${id}`);
      setVersions(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch versions");
    }
  };

  useEffect(() => {
    const fetchNoteInUseEffect = async () => {
      try {
        const { data } = await getNoteById(id);
        setNote(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch note");
        setLoading(false);
      }
    };
    fetchNoteInUseEffect();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (!note) {
    return <div className="text-white text-center mt-20">Note not found</div>;
  }

  const isOwner = note.owner?._id === currentUserId || note.owner === currentUserId;

  const collaborator = note.collaborators?.find(
    (c) => (c.user._id || c.user) === currentUserId,
  );

  const isPending = collaborator?.status === "pending";
  // const canEdit =
  //   isOwner ||
  //   (collaborator?.status === "accepted" &&
  //     collaborator?.permission === "edit");

  // Invite Handler
  const handleInvite = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      await inviteCollaborator(id, { email, permission });
      toast.success("Invitation sent");
      setEmail("");
      setPermission("read");
      setShowInvite(false);
      fetchNote();
    } catch (error) {
      console.log(error);
      toast.error("Failed to invite");
    }
  };

  // Accept Invite
  const handleAccept = async () => {
    try {
      await acceptInvite(id);
      toast.success("Invitation accepted");
      fetchNote();
    } catch (error) {
      console.log(error);
      toast.error("Failed to accept invite");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

      {/* Accept Invitation */}
      {isPending && (
        <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded mb-6 flex justify-between items-center">
        <span>You have been invited to collaborate on this note.</span>
        <button
          onClick={handleAccept}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold"
        >
          Accept Invitation
        </button>
      </div>
      )}

      {/* Invite Button (Owner Only) */}
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
                className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="read">Read</option>
                <option value="edit">Edit</option>
              </select>

              <button type="submit" className="bg-purple-600 px-4 py-2 rounded">
                Send Invite
              </button>
            </form>
          )}
        </div>
      )}

      {/* Content */}
      <div className="bg-gray-900 p-6 rounded mb-8 whitespace-pre-wrap">
        {note.content}
      </div>

      {/* Collaborators Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Collaborators</h2>

        {note.collaborators.length === 0 && (
          <p className="text-gray-400">No collaborators yet</p>
        )}

        {note.collaborators.map((c) => (
          <div
            key={c._id}
            className="bg-gray-800 p-3 rounded mb-2 flex justify-between"
          >
            <span>
              {c.user?.email} ({c.permission})
            </span>
            <span
              className={
                c.status === "accepted" ? "text-green-400" : "text-yellow-400"
              }
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>

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

        {showVersions && (
          <div>
            {versions.length === 0 && (
              <p className="text-gray-400">No versions available</p>
            )}

            {versions.map((v) => (
              <div key={v._id} className="bg-gray-800 p-4 rounded mb-3">
                <p className="text-sm text-gray-400 mb-1">
                  Edited by: {v.editedBy?.email}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  Version: {v.versionNumber}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(v.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePage;
