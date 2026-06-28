"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Shield, User, Database,
  Sparkles, Settings2, Check,
  Trash2, Loader2, AlertTriangle,Brain
} from "lucide-react";
import { deleteAllNotes, getStorageStats } from "@/actions/note.actions";
import toast from "react-hot-toast";

import {
  updateStudyReminder ,
  getNotificationSettings,
} from "@/actions/settings.actions";

import { useUser } from "@clerk/nextjs";





interface StorageStats {
  pdf: string;
  flashcards: string;
  chats: string;
  total: string;
  percent: number;
  noteCount: number;
}

export default function Settings() {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
    const { user } = useUser();

const [notifications, setNotifications] = useState({
 
  studyReminders: false,
});

const [loadingNotifications, setLoadingNotifications] =
  useState(true);

  useEffect(() => {
    getStorageStats()
      .then(setStats)
      .catch(() => toast.error("Failed to load storage stats"))
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
  getNotificationSettings()
    .then((settings) => {
      setNotifications({
       
        studyReminders:
          settings.studyReminders,
      });
    })
    .catch(() =>
      toast.error(
        "Failed to load notification settings"
      )
    )
    .finally(() =>
      setLoadingNotifications(false)
    );
}, []);

  async function handleDeleteAll() {
    setDeleting(true);
    try {
      const result = await deleteAllNotes();
      toast.success(`${result.deleted} notes deleted successfully`);
      setShowConfirm(false);
      // Stats refresh karo
      const fresh = await getStorageStats();
      setStats(fresh);
      router.refresh();
    } catch {
      toast.error("Failed to delete notes");
    } finally {
      setDeleting(false);
    }
  }
  function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
      <p className="text-zinc-500 text-sm mb-1">
        {label}
      </p>

      <p className="text-white font-semibold">
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const isPositive =
    ["Active", "Enabled", "Protected", "Yes"].includes(
      value
    );

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <span className="text-zinc-400 text-sm">
        {label}
      </span>

      <span
        className={`px-2.5   text-xs font-semibold ${
          isPositive
            ? " text-green-400  "
            : " text-red-400  "
        }`}
      >
        {value}
      </span>
    </div>
  );
}
 return (
    <div className="relative max-w-4xl mx-auto py-8 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/8 to-cyan-600/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Settings2 size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Manage your Neuron AI preferences</p>
          </div>
        </div>

        {/* Profile */}
      <Section
  icon={<User size={16} />}
  title="Account Information"
  subtitle="Your account details"
  accent="red"
>
  
    <div className="grid md:grid-cols-3 gap-4">
  <InfoRow
    label="Full Name"
    value={user?.fullName || "Not Available"}
  />

  <InfoRow
    label="Email"
    value={
      user?.primaryEmailAddress?.emailAddress ||
      "Not Available"
    }
  />

  <InfoRow
  label="Member Since"
  value={
    user?.createdAt
      ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(user.createdAt))
      : "Not Available"
  }

  />
</div>
</Section>



 {/* Notifications */}
        <Section icon={<Bell size={16}  />} title="Notifications" subtitle="Stay on track with AI-powered email reminders" accent="green">
          <div className="space-y-3">
            
          
           <NotifRow
  title="Study Reminders"
  desc="Daily revision and Suggestions alerts"
  enabled={notifications.studyReminders}
  onToggle={async () => {
    const newValue = !notifications.studyReminders;

    setNotifications((n) => ({
      ...n,
      studyReminders: newValue,
    }));

 await updateStudyReminder(
  newValue
);

toast.success("Settings saved");
  }}
/>
  </div>
        </Section>
     

        {/* Security */}
   <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">

  {/* Neuron AI Status */}
  <Section
    icon={<Brain size={16} />}
    title="Neuron AI Status"
    subtitle="System services and AI engine"
    accent="red"
  >
    <div className="space-y-3">
      <StatusRow
  label="AI Engine"
  value="Llama 3.3 70B (Groq)"
/>
      <StatusRow label="PDF Engine" value="Active" />
      <StatusRow label="Flashcards" value="Active" />
      <StatusRow label="Reminders" value="Active" />
    </div>
  </Section>

  {/* Divider */}
  <div className="hidden md:block w-px bg-white/10 rounded-full" />

  {/* Account Status */}
  <Section
    icon={<Shield size={16} />}
    title="Account Status"
    subtitle="Security and account health"
    accent="red"
  >
    <div className="space-y-3">
      <StatusRow
        label="Authentication"
        value="Protected"
      />

      <StatusRow
        label="Email Verified"
        value={
          user?.primaryEmailAddress?.verification?.status ===
          "verified"
            ? "Yes"
            : "No"
        }
      />

      <StatusRow
        label="Study Reminders"
        value={
          notifications.studyReminders
            ? "Enabled"
            : "Disabled"
        }
      />

      <StatusRow
        label="Account Status"
        value="Active"
      />
    </div>
  </Section>

</div>

  {/* Storage — LIVE DATA */}
        <Section icon={<Database size={16} className="text-emerald-400" />} title="Storage" subtitle="Monitor and manage your document storage" accent="green">
          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-zinc-500" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Used Storage</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {stats?.noteCount ?? 0} document{(stats?.noteCount ?? 0) !== 1 ? "s" : ""} uploaded
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">{stats?.total ?? "0 B"}</p>
                  <p className="text-zinc-600 text-xs">of 2 GB</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${stats?.percent ?? 0}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-zinc-600 text-xs">{stats?.percent ?? 0}% used</span>
                  <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <Check size={10} />
                    {(stats?.percent ?? 0) < 80 ? "Healthy" : "Running Low"}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "PDFs", value: stats?.pdf ?? "0 B" },
                  { label: "Flashcards", value: stats?.flashcards ?? "0 B" },
                  { label: "Chats", value: stats?.chats ?? "0 B" },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-800/40 border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-white text-sm font-semibold">{item.value}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Delete All */}
              <div className="border-t border-white/5 pt-4">
                {!showConfirm ? (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <div>
                      <p className="text-white text-sm font-medium">Delete All Notes</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Permanently remove all uploaded documents from your workspace and storage.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all duration-200"
                    >
                      <Trash2 size={14} />
                      Clear All
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle size={16} />
                      <p className="text-sm font-semibold">Are you sure?</p>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      This action is permanent and cannot be undone. All notes and their associated PDF files will be permanently removed from your workspace.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAll}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                      >
                        {deleting
                          ? <><Loader2 size={14} className="animate-spin" /> Deleting...</>
                          : <><Trash2 size={14} /> Yes, Delete All</>
                        }
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        disabled={deleting}
                        className="px-4 py-2 rounded-xl bg-zinc-800 border border-white/5 text-zinc-400 text-sm font-medium hover:bg-zinc-700 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Section>

           {/* Footer */}
        <div className="rounded-2xl border border-white/5 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 p-6 text-center">
          <Sparkles size={18} className="mx-auto text-violet-400 mb-3" />
          <p className="text-white font-semibold">Neuron AI Workspace</p>
          <p className="text-zinc-500 text-sm mt-1">Your AI-powered second brain · v0.1.0</p>
        </div>

      </div>
    </div>
  );
}

function Section({
  icon, title, subtitle, accent = "violet", children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: "violet" | "red" | "green";
  children: React.ReactNode;
}) {
  const border = {
    violet: "border-white/5",
    red: "border-red-500/10",
    green: "border-emerald-500/10",
  }[accent];

  return (
    <div className={`rounded-2xl border ${border} bg-zinc-900/50 backdrop-blur-xl p-6`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="text-zinc-400">{icon}</div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-zinc-600 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled ? "bg-violet-500" : "bg-zinc-700"}`}
 >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function NotifRow({ title, desc, enabled, onToggle }: {
  title: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/40 border border-white/5 hover:border-white/10 transition-all duration-200">
      <div>
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}
