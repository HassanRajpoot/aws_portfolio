import "./ProjectEditor.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { useState, useEffect } from "react";
import {
  useRawProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  BackendProject,
} from "@/hooks/useProjects";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";

export function ProjectEditor() {
  const navigate = useNavigate();
  const { data: projects, isLoading: loadingProjects } = useRawProjects();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  // Selected project state
  const [selectedProjId, setSelectedProjId] = useState<string | "new" | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const { data } = await apiClient.post<{ url: string }>("/media/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProjectForm((prev) => ({ ...prev, cover_image: data.url }));
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image. Please check your credentials or network.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Form states
  const [projectForm, setProjectForm] = useState<Omit<BackendProject, "id" | "created_at" | "updated_at">>({
    title: "",
    slug: "",
    category: "Full-Stack Web App",
    summary: "",
    body_markdown: "",
    cover_image: "",
    media_assets: [],
    status: "published",
    featured: true,
    sort_order: 1,
    published_at: null,
  });

  // Handle selected project changes
  useEffect(() => {
    if (selectedProjId === "new") {
      setProjectForm({
        title: "",
        slug: "",
        category: "Full-Stack Web App",
        summary: "",
        body_markdown: "",
        cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6c70724z-rwV-TesbmfZI0ZwVkblK1GFTfwEsG5ZjKe2Usk3tW9FIJhPbWUyw5BgmXN00lCZPs76jSUW5cEQtRgjKlp5gRViH_qDKaRlRxEzD3syl2iaTwMtjr_ZTFHvTzCqnjDp9dh1umNwXUrboh138Lajndeh2zIpxTXTIfNoXyXp323bXzoAlCLoawdKk3U9f6wU-UqfU8TTyDvoWTThhfhHBpMBAKCxm0BXlwqpuyygqp7xeCJ7na4Dh_Z6KCvVsJjAmOsPZ",
        media_assets: [],
        status: "published",
        featured: true,
        sort_order: (projects?.length || 0) + 1,
        published_at: new Date().toISOString(),
      });
    } else if (selectedProjId && projects) {
      const proj = projects.find((p) => p.id === selectedProjId);
      if (proj) {
        setProjectForm({
          title: proj.title,
          slug: proj.slug,
          category: proj.category || "Full-Stack Web App",
          summary: proj.summary || "",
          body_markdown: proj.body_markdown || "",
          cover_image: proj.cover_image || "",
          media_assets: proj.media_assets || [],
          status: proj.status || "published",
          featured: proj.featured,
          sort_order: proj.sort_order,
          published_at: proj.published_at,
        });
      }
    }
  }, [selectedProjId, projects]);

  function handleSignOut() {
    signOut();
    navigate("/admin/sign-in", { replace: true });
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setProjectForm((prev) => ({
      ...prev,
      title,
      slug: selectedProjId === "new" ? slug : prev.slug, // only auto-fill slug for new projects
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.slug.trim()) {
      toast.error("Title and slug are required fields.");
      return;
    }
    try {
      if (selectedProjId === "new") {
        const created = await createProject.mutateAsync(projectForm);
        toast.success(`Project "${created.title}" successfully created.`);
        setSelectedProjId(created.id);
      } else if (selectedProjId) {
        await updateProject.mutateAsync({ id: selectedProjId, payload: projectForm });
        toast.success(`Project "${projectForm.title}" successfully updated.`);
      }
    } catch {
      toast.error("Failed to save project.");
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProjId || selectedProjId === "new") return;
    if (!confirm(`Are you sure you want to permanently delete "${projectForm.title}"?`)) return;
    try {
      await deleteProject.mutateAsync(selectedProjId);
      toast.success("Project deleted successfully.");
      setSelectedProjId(null);
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className="font-body-base text-on-background bg-background antialiased min-h-screen">
      {/* Persistent SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-2xl z-10 flex flex-col py-8 px-6 space-y-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container">terminal</span>
          </div>
          <div>
            <h2 className="text-indigo-500 font-black tracking-widest uppercase text-xs">Owner Workspace</h2>
            <p className="text-slate-500 font-space-grotesk text-[10px] uppercase tracking-tighter">Owner Console</p>
          </div>
        </div>
        <nav className="flex-grow space-y-2">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200 group"
            }
            to="/admin/dashboard"
          >
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-space-grotesk text-sm">Dashboard</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200 group"
            }
            to="/admin/resume"
          >
            <span className="material-symbols-outlined mr-3">description</span>
            <span className="font-space-grotesk text-sm">Resume Manager</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200 group"
            }
            to="/admin/project-editor"
          >
            <span className="material-symbols-outlined mr-3">edit_note</span>
            <span className="font-space-grotesk text-sm">Project Editor</span>
          </NavLink>
        </nav>
        <div className="pt-6 border-t border-white/5 space-y-2">
          <Link
            className="flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            to="/admin/settings"
          >
            <span className="material-symbols-outlined mr-3">settings</span>
            <span>Settings</span>
          </Link>
          <button
            className="flex items-center px-4 py-2 w-full text-xs text-rose-300 transition-colors hover:text-rose-200 text-left"
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
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="font-label-mono text-label-mono text-primary-container mb-2 block uppercase font-bold tracking-wider">
              Content Management
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface">Project Editor</h1>
          </div>
        </header>

        {/* Project Selector Bar */}
        <div className="mb-8 p-6 bg-slate-950/40 rounded border border-white/5 flex items-center justify-between gap-4">
          <div className="flex-grow max-w-md space-y-1">
            <label className="text-[10px] font-label-mono uppercase text-slate-500 tracking-wider">Active Workspace Projects</label>
            <select
              className="w-full bg-slate-900 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-primary outline-none"
              value={selectedProjId || ""}
              onChange={(e) => setSelectedProjId(e.target.value || null)}
            >
              <option value="">-- Choose a project to edit --</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedProjId("new")}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm text-white font-bold transition-all active:scale-95"
            >
              + Create New Project
            </button>
            {selectedProjId && selectedProjId !== "new" && (
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 border border-red-500/20 hover:border-red-500 bg-red-950/20 hover:bg-red-900/20 rounded text-sm text-red-400 font-bold transition-all"
              >
                Delete Project
              </button>
            )}
          </div>
        </div>

        {/* Editor Layout: Asymmetric Bento Grid */}
        {selectedProjId ? (
          <form onSubmit={handleSaveProject} className="grid grid-cols-12 gap-8">
            {/* Left Column: Primary Details */}
            <div className="col-span-8 space-y-8">
              {/* Project Identity Card */}
              <section className="glass-panel p-8 rounded-lg">
                <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-2">
                  <span className="material-symbols-outlined text-primary">article</span>
                  <h3 className="font-label-mono text-label-mono uppercase font-bold text-white">Core Information</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Project Title</label>
                      <input
                        className="w-full bg-slate-900 border border-white/10 rounded px-4 py-3 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white"
                        placeholder="e.g. Quantum Metrics Dashboard"
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Slug (URL string)</label>
                      <input
                        className="w-full bg-slate-900 border border-white/10 rounded px-4 py-3 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white font-mono"
                        placeholder="quantum-metrics-dashboard"
                        type="text"
                        required
                        value={projectForm.slug}
                        onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Summary / Kicker Description</label>
                    <input
                      className="w-full bg-slate-900 border border-white/10 rounded px-4 py-3 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white"
                      placeholder="Brief overview summarizing the build..."
                      type="text"
                      required
                      value={projectForm.summary}
                      onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Detailed Case Study (Markdown Body)</label>
                    <textarea
                      className="w-full bg-slate-900 border border-white/10 rounded px-4 py-3 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white font-mono"
                      placeholder="Technical specifications, challenges overcome, architecture notes and outcome outcomes..."
                      rows={12}
                      value={projectForm.body_markdown || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, body_markdown: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* Asset Upload Card */}
              <section className="glass-panel p-8 rounded-lg">
                <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-2">
                  <span className="material-symbols-outlined text-primary">image</span>
                  <h3 className="font-label-mono text-label-mono uppercase font-bold text-white">Visual Assets</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Hero Cover Image URL</label>
                    <input
                      className="w-full bg-slate-900 border border-white/10 rounded px-4 py-2 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white"
                      placeholder="https://example.com/cover.jpg"
                      type="text"
                      value={projectForm.cover_image || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, cover_image: e.target.value })}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Or Upload Image File</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        id="image-file-upload"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="image-file-upload"
                        className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded text-xs font-bold font-mono cursor-pointer hover:bg-indigo-600/30 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">cloud_upload</span>
                        {uploadingImage ? "Uploading..." : "Choose File"}
                      </label>
                      {projectForm.cover_image && (
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, cover_image: "" })}
                          className="text-xs text-rose-400 hover:underline"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Metadata & Controls */}
            <div className="col-span-4 space-y-8">
              {/* Actions Box */}
              <section className="p-6 rounded-lg border border-indigo-500/20 bg-indigo-950/10 space-y-4">
                <h4 className="font-space-grotesk text-sm font-bold text-white">Publish Action</h4>
                <p className="text-xs text-slate-500">Publish this project deployment to your active portfolio space.</p>
                <button
                  type="submit"
                  disabled={createProject.isPending || updateProject.isPending}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white rounded font-space-grotesk uppercase tracking-widest active:scale-95 transition-transform"
                >
                  {selectedProjId === "new" ? "Create & Publish" : "Publish Changes"}
                </button>
              </section>

              {/* Project Metadata Card */}
              <section className="glass-panel p-8 rounded-lg">
                <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-2">
                  <span className="material-symbols-outlined text-primary">settings_input_component</span>
                  <h3 className="font-label-mono text-label-mono uppercase font-bold text-white">Metadata</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Category Label</label>
                    <input
                      className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white text-sm"
                      placeholder="e.g. SaaS Engine / Rust Library"
                      type="text"
                      value={projectForm.category || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Sort Order</label>
                      <input
                        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-on-surface font-body-base outline-none focus:border-primary transition-all text-white text-sm"
                        type="number"
                        value={projectForm.sort_order}
                        onChange={(e) => setProjectForm({ ...projectForm, sort_order: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <label className="block font-label-mono text-[10px] text-outline uppercase mb-2">Deployment Status</label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-on-surface text-white text-sm outline-none"
                        value={projectForm.status}
                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft / Offline</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          className="sr-only peer"
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        />
                        <div className="w-10 h-5 bg-slate-800 border border-white/10 rounded-full peer peer-checked:bg-tertiary transition-colors"></div>
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                      <span className="ml-3 text-xs text-on-surface text-slate-300 font-bold uppercase">Feature on Homepage</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Live Preview Card */}
              <section className="bg-slate-950 border border-white/10 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-space-grotesk text-xs font-bold text-slate-500 uppercase tracking-widest">Active Preview</h4>
                  <span className="material-symbols-outlined text-indigo-400 text-sm">visibility</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-slate-900 overflow-hidden shadow">
                  <div className="aspect-video relative overflow-hidden">
                    {projectForm.cover_image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={projectForm.cover_image.startsWith("/") ? `http://localhost:8000${projectForm.cover_image}` : projectForm.cover_image}
                        alt={projectForm.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center font-mono text-[8px] text-slate-600">
                        NO IMAGE URL PROVIDED
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="border border-primary/30 text-primary px-2 py-0.5 font-label-mono text-[9px] uppercase tracking-widest">
                      {projectForm.category}
                    </span>
                    <h5 className="font-display-lg text-sm text-white font-bold mt-1 truncate">{projectForm.title || "Untitled Project"}</h5>
                    <p className="line-clamp-2 text-[10px] text-slate-500 leading-relaxed font-body-sm">
                      {projectForm.summary || "No project overview summary has been provided yet."}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </form>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/5 bg-slate-950/20 rounded">
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-4 block">folder_open</span>
            <h3 className="text-white font-bold text-base mb-1">No Active Project Selected</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Choose a project from the selector dropdown above to start editing, or create a brand new one.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
