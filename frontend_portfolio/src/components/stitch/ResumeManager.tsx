import "./ResumeManager.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { useState, useEffect } from "react";
import {
  useExperience,
  useEducation,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  useCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
  BackendExperience,
  BackendEducation,
  BackendCertification,
} from "@/hooks/useResume";
import {
  useSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
  BackendSkill,
} from "@/hooks/useSkills";
import { toast } from "sonner";
import { usePublicSettings } from "@/hooks/useSettings";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "PRESENT";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

export function ResumeManager() {
  const navigate = useNavigate();
  const { data: experiences, isLoading: loadingExp } = useExperience();
  const { data: education, isLoading: loadingEdu } = useEducation();
  const { data: certifications, isLoading: loadingCerts } = useCertifications();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: settings } = usePublicSettings();

  // Mutations
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();

  // Selected Item States for Editing
  const [selectedExpId, setSelectedExpId] = useState<string | "new" | null>(null);
  const [selectedEduId, setSelectedEduId] = useState<string | "new" | null>(null);
  const [selectedCertId, setSelectedCertId] = useState<string | "new" | null>(null);

  // Form states
  const [expForm, setExpForm] = useState<Omit<BackendExperience, "id">>({
    company_name: "",
    role_title: "",
    start_date: "",
    end_date: null,
    location: "",
    employment_type: "Full_Time",
    description: "",
    sort_order: 1,
  });

  const [eduForm, setEduForm] = useState<Omit<BackendEducation, "id">>({
    institution: "",
    degree: "",
    start_date: "",
    end_date: null,
    details: "",
    sort_order: 1,
  });

  const [certForm, setCertForm] = useState<Omit<BackendCertification, "id">>({
    title: "",
    icon: "verified",
    meta: "",
    sort_order: 1,
  });

  const [newSkillForm, setNewSkillForm] = useState({
    name: "",
    score: 85,
    value_label: "EXPERT",
    sort_order: 1,
  });

  const [showSkillForm, setShowSkillForm] = useState(false);

  // Populate Exp Form
  useEffect(() => {
    if (selectedExpId === "new") {
      setExpForm({
        company_name: "",
        role_title: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: null,
        location: "Remote",
        employment_type: "Full_Time",
        description: "",
        sort_order: (experiences?.length || 0) + 1,
      });
    } else if (selectedExpId && experiences) {
      const exp = experiences.find((e) => e.id === selectedExpId);
      if (exp) {
        setExpForm({
          company_name: exp.company_name,
          role_title: exp.role_title,
          start_date: exp.start_date ? exp.start_date.split("T")[0] : "",
          end_date: exp.end_date ? exp.end_date.split("T")[0] : null,
          location: exp.location || "",
          employment_type: exp.employment_type || "Full_Time",
          description: exp.description || "",
          sort_order: exp.sort_order,
        });
      }
    }
  }, [selectedExpId, experiences]);

  // Populate Edu Form
  useEffect(() => {
    if (selectedEduId === "new") {
      setEduForm({
        institution: "",
        degree: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: null,
        details: "",
        sort_order: (education?.length || 0) + 1,
      });
    } else if (selectedEduId && education) {
      const edu = education.find((e) => e.id === selectedEduId);
      if (edu) {
        setEduForm({
          institution: edu.institution,
          degree: edu.degree,
          start_date: edu.start_date ? edu.start_date.split("T")[0] : "",
          end_date: edu.end_date ? edu.end_date.split("T")[0] : null,
          details: edu.details || "",
          sort_order: edu.sort_order,
        });
      }
    }
  }, [selectedEduId, education]);

  // Populate Cert Form
  useEffect(() => {
    if (selectedCertId === "new") {
      setCertForm({
        title: "",
        icon: "verified",
        meta: "",
        sort_order: (certifications?.length || 0) + 1,
      });
    } else if (selectedCertId && certifications) {
      const cert = certifications.find((c) => c.id === selectedCertId);
      if (cert) {
        setCertForm({
          title: cert.title,
          icon: cert.icon || "verified",
          meta: cert.meta || "",
          sort_order: cert.sort_order,
        });
      }
    }
  }, [selectedCertId, certifications]);

  function handleSignOut() {
    signOut();
    navigate("/admin/sign-in", { replace: true });
  }

  // Experience CRUD operations
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedExpId === "new") {
        await createExperience.mutateAsync(expForm);
        toast.success("Work experience added successfully.");
      } else if (selectedExpId) {
        await updateExperience.mutateAsync({ id: selectedExpId, payload: expForm });
        toast.success("Work experience updated successfully.");
      }
      setSelectedExpId(null);
    } catch {
      toast.error("Failed to save experience.");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    try {
      await deleteExperience.mutateAsync(id);
      toast.success("Experience deleted successfully.");
      if (selectedExpId === id) setSelectedExpId(null);
    } catch {
      toast.error("Failed to delete experience.");
    }
  };

  // Education CRUD operations
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEduId === "new") {
        await createEducation.mutateAsync(eduForm);
        toast.success("Education entry added successfully.");
      } else if (selectedEduId) {
        await updateEducation.mutateAsync({ id: selectedEduId, payload: eduForm });
        toast.success("Education entry updated successfully.");
      }
      setSelectedEduId(null);
    } catch {
      toast.error("Failed to save education.");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this academic entry?")) return;
    try {
      await deleteEducation.mutateAsync(id);
      toast.success("Education deleted successfully.");
      if (selectedEduId === id) setSelectedEduId(null);
    } catch {
      toast.error("Failed to delete education.");
    }
  };

  // Certification CRUD operations
  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCertId === "new") {
        await createCertification.mutateAsync(certForm);
        toast.success("Certification added successfully.");
      } else if (selectedCertId) {
        await updateCertification.mutateAsync({ id: selectedCertId, payload: certForm });
        toast.success("Certification updated successfully.");
      }
      setSelectedCertId(null);
    } catch {
      toast.error("Failed to save certification.");
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await deleteCertification.mutateAsync(id);
      toast.success("Certification deleted successfully.");
      if (selectedCertId === id) setSelectedCertId(null);
    } catch {
      toast.error("Failed to delete certification.");
    }
  };

  // Skill CRUD operations
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.name.trim()) return;
    try {
      await createSkill.mutateAsync({
        ...newSkillForm,
        sort_order: (skills?.length || 0) + 1,
      });
      toast.success(`Skill "${newSkillForm.name}" created.`);
      setNewSkillForm({ name: "", score: 85, value_label: "EXPERT", sort_order: 1 });
      setShowSkillForm(false);
    } catch {
      toast.error("Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the skill "${name}"?`)) return;
    try {
      await deleteSkill.mutateAsync(id);
      toast.success(`Skill "${name}" deleted.`);
    } catch {
      toast.error("Failed to delete skill.");
    }
  };

  return (
    <div className="font-body-base bg-surface selection:bg-primary/30 min-h-screen text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-2xl z-10 flex flex-col py-8 px-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-xl">terminal</span>
          </div>
          <div>
            <h2 className="text-indigo-500 font-black tracking-widest uppercase text-xs">Owner Workspace</h2>
            <p className="font-label-mono text-[10px] text-slate-500 uppercase tracking-tighter">Owner Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            }
            to="/admin/dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-space-grotesk text-sm">Dashboard</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            }
            to="/admin/resume"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="font-space-grotesk text-sm">Resume Manager</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            }
            to="/admin/project-editor"
          >
            <span className="material-symbols-outlined">edit_note</span>
            <span className="font-space-grotesk text-sm">Project Editor</span>
          </NavLink>
        </nav>
        <div className="space-y-1 pt-4 border-t border-white/5">
          <Link
            className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 transition-all text-sm"
            to="/admin/settings"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            <span>Settings</span>
          </Link>
          <button
            className="flex items-center w-full px-4 py-2 text-xs text-rose-300 transition-colors hover:text-rose-200 text-left"
            onClick={handleSignOut}
            type="button"
          >
            <span className="material-symbols-outlined mr-3 text-sm">logout</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 min-h-screen p-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <p className="font-label-mono text-primary uppercase mb-2">Editor Mode / Active</p>
            <h1 className="font-display-lg text-4xl text-on-surface">Resume Manager</h1>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Form Editor */}
          <div className="col-span-7 space-y-8">
            {/* 1. Work Experience Form & Selector */}
            <section className="p-8 rounded-xl bg-surface-container-low border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="font-headline-md text-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">business_center</span>
                  Work Experience
                </h3>
                <button
                  onClick={() => setSelectedExpId("new")}
                  className="text-primary text-sm font-label-mono flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-xs">add_circle</span>
                  ADD POSITION
                </button>
              </div>

              {/* Positions List */}
              <div className="mb-6 space-y-3">
                {loadingExp && <p className="text-sm text-slate-500">Loading experiences...</p>}
                {experiences?.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-4 rounded border transition-all flex justify-between items-center ${
                      selectedExpId === exp.id
                        ? "bg-indigo-500/10 border-indigo-500"
                        : "bg-slate-900/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div onClick={() => setSelectedExpId(exp.id)} className="cursor-pointer flex-grow">
                      <h4 className="font-bold text-sm text-white">{exp.role_title}</h4>
                      <p className="text-xs text-slate-400">
                        {exp.company_name} — {formatDate(exp.start_date)} to {formatDate(exp.end_date)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Delete experience"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Form details */}
              {selectedExpId && (
                <form onSubmit={handleSaveExperience} className="space-y-6 bg-slate-950/40 p-6 rounded border border-white/5">
                  <h4 className="text-white font-bold text-sm border-b border-white/5 pb-2">
                    {selectedExpId === "new" ? "New Position Details" : "Edit Position Details"}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Job Title</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        required
                        value={expForm.role_title}
                        onChange={(e) => setExpForm({ ...expForm, role_title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Company</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        required
                        value={expForm.company_name}
                        onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Start Date</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="date"
                        required
                        value={expForm.start_date}
                        onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">End Date (Leave blank for Present)</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="date"
                        value={expForm.end_date || ""}
                        onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value || null })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Location</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        value={expForm.location || ""}
                        onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Employment Type</label>
                      <select
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        value={expForm.employment_type || "Full_Time"}
                        onChange={(e) => setExpForm({ ...expForm, employment_type: e.target.value })}
                      >
                        <option value="Full_Time">Full-Time</option>
                        <option value="Part_Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Sort Order</label>
                    <input
                      className="w-24 bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                      type="number"
                      value={expForm.sort_order}
                      onChange={(e) => setExpForm({ ...expForm, sort_order: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Description (one bullet per line)</label>
                    <textarea
                      className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all font-mono"
                      rows={5}
                      required
                      value={expForm.description || ""}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createExperience.isPending || updateExperience.isPending}
                      className="px-6 py-2 bg-indigo-600 rounded text-sm text-white font-bold hover:brightness-110 active:scale-95 transition-all"
                    >
                      Save Position
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedExpId(null)}
                      className="px-6 py-2 border border-white/10 rounded text-sm text-slate-400 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* 2. Education Form & Selector */}
            <section className="p-8 rounded-xl bg-surface-container-low border border-white/5">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="font-headline-md text-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">school</span>
                  Education
                </h3>
                <button
                  onClick={() => setSelectedEduId("new")}
                  className="text-primary text-sm font-label-mono flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-xs">add_circle</span>
                  ADD ACADEMIC BASE
                </button>
              </div>

              {/* Education List */}
              <div className="mb-6 space-y-3">
                {loadingEdu && <p className="text-sm text-slate-500">Loading education entries...</p>}
                {education?.map((edu) => (
                  <div
                    key={edu.id}
                    className={`p-4 rounded border transition-all flex justify-between items-center ${
                      selectedEduId === edu.id
                        ? "bg-indigo-500/10 border-indigo-500"
                        : "bg-slate-900/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div onClick={() => setSelectedEduId(edu.id)} className="cursor-pointer flex-grow">
                      <h4 className="font-bold text-sm text-white">{edu.degree}</h4>
                      <p className="text-xs text-slate-400">
                        {edu.institution} — {formatDate(edu.start_date)} to {formatDate(edu.end_date)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Delete education"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Form details */}
              {selectedEduId && (
                <form onSubmit={handleSaveEducation} className="space-y-6 bg-slate-950/40 p-6 rounded border border-white/5">
                  <h4 className="text-white font-bold text-sm border-b border-white/5 pb-2">
                    {selectedEduId === "new" ? "New Education Details" : "Edit Education Details"}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Degree</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        required
                        value={eduForm.degree}
                        onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Institution</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        required
                        value={eduForm.institution}
                        onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Start Date</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="date"
                        value={eduForm.start_date || ""}
                        onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">End Date (or empty)</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="date"
                        value={eduForm.end_date || ""}
                        onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value || null })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Details (GPA / Honors)</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        value={eduForm.details || ""}
                        onChange={(e) => setEduForm({ ...eduForm, details: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Sort Order</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="number"
                        value={eduForm.sort_order}
                        onChange={(e) => setEduForm({ ...eduForm, sort_order: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createEducation.isPending || updateEducation.isPending}
                      className="px-6 py-2 bg-indigo-600 rounded text-sm text-white font-bold hover:brightness-110 active:scale-95 transition-all"
                    >
                      Save Academic Base
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedEduId(null)}
                      className="px-6 py-2 border border-white/10 rounded text-sm text-slate-400 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* 2.5 Certifications Form & Selector */}
            <section className="p-8 rounded-xl bg-surface-container-low border border-white/5">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="font-headline-md text-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-500">verified</span>
                  Verified Certifications
                </h3>
                <button
                  onClick={() => setSelectedCertId("new")}
                  className="text-primary text-sm font-label-mono flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-xs">add_circle</span>
                  ADD CERTIFICATION
                </button>
              </div>

              {/* Certifications List */}
              <div className="mb-6 space-y-3">
                {loadingCerts && <p className="text-sm text-slate-500">Loading certifications...</p>}
                {certifications?.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded border transition-all flex justify-between items-center ${
                      selectedCertId === c.id
                        ? "bg-indigo-500/10 border-indigo-500"
                        : "bg-slate-900/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div onClick={() => setSelectedCertId(c.id)} className="cursor-pointer flex-grow flex items-center gap-3">
                      <span className="material-symbols-outlined text-indigo-400">{c.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{c.title}</h4>
                        <p className="text-xs text-slate-400">
                          {c.meta || "No metadata"} (Order: {c.sort_order})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCertification(c.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Delete certification"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Form details */}
              {selectedCertId && (
                <form onSubmit={handleSaveCertification} className="space-y-6 bg-slate-950/40 p-6 rounded border border-white/5">
                  <h4 className="text-white font-bold text-sm border-b border-white/5 pb-2">
                    {selectedCertId === "new" ? "New Certification Details" : "Edit Certification Details"}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Certification Title</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        required
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Metadata / Expiration</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="text"
                        placeholder="e.g. ID: AWS-7782-990 or VALID UNTIL: 2026"
                        value={certForm.meta || ""}
                        onChange={(e) => setCertForm({ ...certForm, meta: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Material Icon Name</label>
                      <select
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        value={certForm.icon || "verified"}
                        onChange={(e) => setCertForm({ ...certForm, icon: e.target.value })}
                      >
                        <option value="verified">Verified (verified)</option>
                        <option value="cloud">Cloud (cloud)</option>
                        <option value="security">Security (security)</option>
                        <option value="memory">Memory / Chip (memory)</option>
                        <option value="school">School (school)</option>
                        <option value="terminal">Terminal (terminal)</option>
                        <option value="shield">Shield (shield)</option>
                        <option value="workspace_premium">Premium Ribbon (workspace_premium)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Sort Order</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none transition-all"
                        type="number"
                        value={certForm.sort_order}
                        onChange={(e) => setCertForm({ ...certForm, sort_order: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createCertification.isPending || updateCertification.isPending}
                      className="px-6 py-2 bg-indigo-600 rounded text-sm text-white font-bold hover:brightness-110 active:scale-95 transition-all"
                    >
                      Save Certification
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCertId(null)}
                      className="px-6 py-2 border border-white/10 rounded text-sm text-slate-400 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* 3. Technical Skills Section */}
            <section className="p-8 rounded-xl bg-surface-container-low border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Technical Capabilities
                </h3>
                <button
                  onClick={() => setShowSkillForm(!showSkillForm)}
                  className="text-primary text-sm font-label-mono flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-xs">add_circle</span>
                  {showSkillForm ? "HIDE PANEL" : "ADD SKILL"}
                </button>
              </div>

              {/* Add Skill Mini Form */}
              {showSkillForm && (
                <form onSubmit={handleAddSkill} className="mb-6 p-4 border border-white/10 rounded bg-slate-950/40 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-label-mono">Skill Name</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none"
                        type="text"
                        required
                        placeholder="e.g. Next.js"
                        value={newSkillForm.name}
                        onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-label-mono">Proficiency Label</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none"
                        type="text"
                        placeholder="EXPERT / ADVANCED"
                        value={newSkillForm.value_label}
                        onChange={(e) => setNewSkillForm({ ...newSkillForm, value_label: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-label-mono">Score (0-100)</label>
                      <input
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none"
                        type="number"
                        min="0"
                        max="100"
                        value={newSkillForm.score}
                        onChange={(e) => setNewSkillForm({ ...newSkillForm, score: parseInt(e.target.value) || 85 })}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 rounded text-xs text-white hover:bg-indigo-500"
                  >
                    Add Skill
                  </button>
                </form>
              )}

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-3">
                {loadingSkills && <p className="text-slate-500 text-xs">Loading skills...</p>}
                {skills?.map((sk) => (
                  <div
                    key={sk.id}
                    className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-label-mono rounded-full flex items-center gap-2"
                  >
                    <span>
                      {sk.name} ({sk.score}%)
                    </span>
                    <span
                      onClick={() => handleDeleteSkill(sk.id, sk.name)}
                      className="material-symbols-outlined text-[12px] cursor-pointer text-slate-500 hover:text-rose-400"
                      title="Delete skill"
                    >
                      close
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Live Preview */}
          <div className="col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="font-label-mono text-[10px] text-slate-500 uppercase tracking-widest">Public Site Preview</p>
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/40"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/40"></span>
                </div>
              </div>

              {/* Preview Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl overflow-y-auto max-h-[768px] custom-scrollbar">
                <div className="aspect-video relative overflow-hidden border-b border-white/5">
                  <img
                    className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuADNkMUrwkisKOlxzDym1GlpGXRp2ETX_UFzdygN4Ld6dfQiXS3Bn2hPQW7nr-l3HvNaMbX-PXZ9X--A408Ggzt6HaHHDq_7_He-SblJqstMaGDE814fHCvkBWpvr4pvBhjXhhfbqDpaoOVzNjyp_k6RxmpAGQosVFRIIXy_5uNVklrwpZtmu_yHqmqJm309OLBWyud9bp7YwrZW1eR6dFEA0BKWqcWrLNvgfiw2yNKAVcV1ODpgPYdP7hstRLNb3nbmoe7qhsL2ZZW"
                    alt="Cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <h4 className="font-display-lg text-2xl text-white">{settings?.site_title || "DevEngine"}</h4>
                    <p className="font-label-mono text-primary text-xs uppercase">{settings?.site_subtitle || "Portfolio"}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Experiences Preview */}
                  <section>
                    <h5 className="font-label-mono text-slate-500 text-[10px] tracking-widest border-b border-white/5 pb-2 mb-4">
                      EXPERIENCE
                    </h5>
                    <div className="space-y-6">
                      {experiences && experiences.length > 0 ? (
                        experiences.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start">
                              <p className="font-headline-md text-sm text-on-surface font-bold">{exp.company_name}</p>
                              <span className="font-label-mono text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{exp.role_title}</p>
                            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed whitespace-pre-line">
                              {exp.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-600">No experiences defined.</p>
                      )}
                    </div>
                  </section>

                  {/* Education Preview */}
                  <section>
                    <h5 className="font-label-mono text-slate-500 text-[10px] tracking-widest border-b border-white/5 pb-2 mb-4">
                      EDUCATION
                    </h5>
                    <div className="space-y-4">
                      {education && education.length > 0 ? (
                        education.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex justify-between">
                              <p className="font-headline-md text-sm text-on-surface font-bold">{edu.institution}</p>
                              <span className="text-[9px] font-label-mono text-slate-400">
                                {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{edu.degree}</p>
                            {edu.details && <p className="text-[10px] text-slate-600 mt-1">{edu.details}</p>}
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-600">No academic entries defined.</p>
                      )}
                    </div>
                  </section>

                  {/* Certifications Preview */}
                  <section>
                    <h5 className="font-label-mono text-slate-500 text-[10px] tracking-widest border-b border-white/5 pb-2 mb-4">
                      CERTIFICATIONS
                    </h5>
                    <div className="space-y-4">
                      {certifications && certifications.length > 0 ? (
                        certifications.map((c) => (
                          <div key={c.id} className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-indigo-400 text-sm">{c.icon}</span>
                            <div>
                              <p className="font-headline-md text-xs text-on-surface font-bold">{c.title}</p>
                              {c.meta && <p className="text-[10px] text-slate-500 font-mono">{c.meta}</p>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-600">No certifications defined.</p>
                      )}
                    </div>
                  </section>

                  {/* Technical Stack Preview */}
                  <section>
                    <h5 className="font-label-mono text-slate-500 text-[10px] tracking-widest border-b border-white/5 pb-2 mb-4">
                      TECH STACK
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {skills && skills.length > 0 ? (
                        skills.map((sk) => (
                          <span
                            key={sk.id}
                            className="text-[9px] font-label-mono px-2 py-1 bg-white/5 rounded border border-white/5 text-indigo-400"
                          >
                            {sk.name.toUpperCase()}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-600">No skills defined.</span>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              <Link
                to="/resume"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-primary/20 text-primary font-body-sm hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View Public Link
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="ml-72 w-[calc(100%-18rem)] border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto py-12 px-8 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-4">
            <span className="text-indigo-500 font-bold">DevEngine Console</span>
            <span>© 2026 — Integrated Workspace</span>
          </div>
          <div className="flex gap-8">
            <a className="hover:text-indigo-400 transition-colors" href="https://github.com">
              GitHub
            </a>
            <a className="hover:text-indigo-400 transition-colors" href="https://linkedin.com">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
