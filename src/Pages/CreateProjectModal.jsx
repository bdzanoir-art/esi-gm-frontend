import { useState } from "react";
import ThemeToggel from '../Components/ThemToggel';
// ─── CreateProjectModal ───────────────────────────────────────────────────────
export default function CreateProjectModal({ onClose, onCreate }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([
    { name: "Sarah Student", email: "m.student@esi-sba.dz" },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim()) {
      setMembers((prev) => [
        ...prev,
        { name: newMemberName.trim(), email: newMemberEmail.trim() },
      ]);
      setNewMemberName("");
      setNewMemberEmail("");
    }
  };

  const handleCreate = () => {
    if (!projectName.trim()) return;
    onCreate?.({
      name: projectName,
      description: description,
      team_members: members,
    });
    onClose?.();
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {/* ── Modal Card ── */}
      <div
        className="w-full max-w-[520px] mx-4 rounded-2xl p-7 flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--card)",
          border: "1px solid var(--card-border)",
          fontFamily: "Inter",
        }}
      >
        {/* Title */}
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-titles)" }}
        >
          Create New Project
        </h2>

        {/* Project Name */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-titles)" }}
          >
            Project Name
          </label>
          <input
            type="text"
            placeholder="e.g., IoT Weather Station"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            style={{
              background: "var(--small-custom)",
              border: "1px solid var(--card-border, rgba(255,255,255,0.1))",
              color: "var(--title-custom, #e2e8f0)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "#51A2FF")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--card-border, rgba(255,255,255,0.1))") }
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-titles)" }}
          >
            Description
          </label>
          <textarea
            placeholder="Describe your project..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all"
            style={{
              background: "var(--small-custom)",
              border: "1px solid var(--card-border, rgba(255,255,255,0.1))",
              color: "var(--text-title-custom, #e2e8f0)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "#51A2FF")
            }
            onBlur={(e) =>
              (e.target.style.borderColor =
                "var(--card-border, rgba(255,255,255,0.1))")
            }
          />
        </div>

        {/* Team Members */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-titles)" }}
          >
            Team Members
          </label>

          {/* Existing members list */}
          <div className="flex flex-col gap-2">
            {members.map((m, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3"
                style={{
                  background: "var(--small-custom)",
                  border:
                    "1px solid var(--card-border, rgba(255,255,255,0.08))",
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-titles)" }}
                >
                  {m.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--small-custom, #64748b)" }}
                >
                  {m.email}
                </p>
              </div>
            ))}
          </div>

          {/* Add member sub-card */}
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              background: "var(--title-custom)",
              border: "1px solid var(--card-border, rgba(255,255,255,0.08))",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-titles)" }}
            >
              Add Team Member
            </p>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="flex-1 rounded-xl px-1 py-2 text-sm outline-none transition-all w-[20px] "
                style={{
                  background: "var(--card, #0f1b2d)",
                  border:"1px solid var(--card-border, rgba(255,255,255,0.1))", color: "var(--title-custom, #e2e8f0)", }}
                onFocus={(e) => (e.target.style.borderColor = "#51A2FF")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    "var(--card-border, rgba(255,255,255,0.1))")
                }
              />
              <input
                type="email"
                placeholder="Member email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  background: "var(--card, #0f1b2d)",
                  border:
                    "1px solid var(--card-border, rgba(255,255,255,0.1))",
                  color: "var(--text-titles, #e2e8f0)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#51A2FF")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    "var(--card-border, rgba(255,255,255,0.1))")
                }
                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              />
            </div>
            <button
              onClick={handleAddMember}
              className="self-start text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#51A2FF" }}
            >
              + Add Member
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 mt-1">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-3 text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "var(--input-bg, #0d1a2d)",
              border: "1px solid var(--card-border, rgba(255,255,255,0.1))",
              color: "var(--small-custom, #94a3b8)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!projectName.trim()}
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#2B4C9F" }}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}