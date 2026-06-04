import "./AdminDashboard.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { useProjects } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";
import { useExperience, useEducation } from "@/hooks/useResume";
import { useContactInquiries } from "@/hooks/useInquiries";

export function AdminDashboard() {
  const navigate = useNavigate();

  // Fetch real-time data for dashboard metrics
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: experiences } = useExperience();
  const { data: education } = useEducation();
  const { data: inquiries, isLoading: loadingInquiries } = useContactInquiries();

  function handleSignOut() {
    signOut();
    navigate("/admin/sign-in", { replace: true });
  }

  // Generate dynamic stats
  const totalProjects = projects?.length || 0;
  const totalSkills = skills?.length || 0;
  const totalMilestones = (experiences?.length || 0) + (education?.length || 0);
  const newInquiriesCount = inquiries?.filter((inq) => inq.status === "new").length || 0;

  return (
    <div className="bg-background text-on-background min-h-screen font-body-base selection:bg-primary/30">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-2xl z-10 flex flex-col py-8 px-6 space-y-8 font-space-grotesk text-sm">
        <div className="flex flex-col space-y-1">
          <span className="text-indigo-500 font-black tracking-widest uppercase text-xs">Owner Workspace</span>
          <div className="flex items-center space-x-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-white/10">
              <img
                alt="Developer Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwnhhbCEy-xuGD-DsoPqnx4oGuroxd0F-jb8hoWnHmbvk3KYRjXwaLi0h942sqUfs2VFxj7Odok6UZ5S9GGoOrLYdWecZDrGnvMSgNWTmG9HercA7unBaUO0nuuFwVaEAIShYo1g6AamEkU3EUl3zhqmUrtdxiOmocoooXw8CWZo4Tht_6tAcRJCOnkjN6nVhgLeu8gQbzhNYyZ820_COF7Cx9bpcknuoYPXAW27Iavml741-JJrQi0C6JEntR-_1KmWVDxpC_nCZx"
              />
            </div>
            <div>
              <p className="text-on-surface font-bold text-sm">Owner Console</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">DevEngine Portfolio</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow space-y-2">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            }
            to="/admin/dashboard"
          >
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-bold">Dashboard</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            }
            to="/admin/resume"
          >
            <span className="material-symbols-outlined mr-3">description</span>
            <span>Resume Manager</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-l-md transition-all duration-200"
                : "flex items-center px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            }
            to="/admin/project-editor"
          >
            <span className="material-symbols-outlined mr-3">edit_note</span>
            <span>Project Editor</span>
          </NavLink>
        </nav>
        <div className="pt-4 border-t border-white/5 space-y-4">
          <Link
            className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform glow-indigo"
            to="/admin/project-editor"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Project</span>
          </Link>
          <div className="space-y-1">
            <Link
              className="flex items-center px-4 py-2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
              to="/admin/settings"
            >
              <span className="material-symbols-outlined mr-3 text-sm">settings</span>
              <span>Settings</span>
            </Link>
            <button
              className="flex items-center px-4 py-2 text-xs text-rose-300 transition-colors hover:text-rose-200 w-full text-left"
              onClick={handleSignOut}
              type="button"
            >
              <span className="material-symbols-outlined mr-3 text-sm">logout</span>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 p-12 min-h-screen">
        {/* Top Utility Bar */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">System Overview</h1>
            <p className="text-slate-500 font-body-sm text-body-sm mt-1">Real-time metrics for your professional ecosystem.</p>
          </div>
        </header>

        {/* Bento Grid Metrics */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          {/* Main Traffic Mock Graph */}
          <div className="col-span-8 glass-panel rounded-xl p-8 flex flex-col justify-between h-[400px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-mono text-label-mono text-indigo-400 uppercase">System Core Status</p>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-2">Active Services Operational</h2>
              </div>
            </div>
            {/* Visual vector bars represent project sort order */}
            <div className="flex-grow flex items-end space-x-4 mt-8 px-2">
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[40%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-1/2 rounded-t-sm"></div>
              </div>
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[65%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-3/4 rounded-t-sm"></div>
              </div>
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[55%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-2/3 rounded-t-sm"></div>
              </div>
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[85%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-4/5 rounded-t-sm"></div>
              </div>
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[70%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-1/2 rounded-t-sm"></div>
              </div>
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[95%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-full rounded-t-sm"></div>
              </div>
              <div className="flex-1 bg-indigo-500/10 rounded-t-sm relative group h-[60%] hover:bg-indigo-500/30 transition-all">
                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 h-1/3 rounded-t-sm"></div>
              </div>
            </div>
            <div className="flex justify-between text-slate-600 font-label-mono text-[10px] mt-6">
              <span>RUST</span>
              <span>PYTHON</span>
              <span>NODE</span>
              <span>POSTGRES</span>
              <span>DOCKER</span>
              <span>AWS</span>
              <span>VITE</span>
            </div>
          </div>

          {/* Quick Metrics Widget */}
          <div className="col-span-4 flex flex-col space-y-6">
            <div className="glass-panel rounded-xl p-6 flex-1 border-l-4 border-l-primary flex flex-col justify-between">
              <div>
                <p className="font-label-mono text-label-mono text-slate-500 uppercase mb-2">Workspace Totals</p>
                <h3 className="font-display-lg text-4xl text-on-surface font-bold">{totalProjects}</h3>
                <p className="text-body-sm text-slate-400 mt-1">Active Projects Deployed</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500 font-mono">
                <span>SKILLS: {totalSkills}</span>
                <span>MILESTONES: {totalMilestones}</span>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex-1">
              <p className="font-label-mono text-label-mono text-slate-500 uppercase mb-4">Quick Links</p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/projects"
                  target="_blank"
                  className="bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-bold py-3 px-2 rounded border border-white/5 transition-colors flex flex-col items-center space-y-2 text-center"
                >
                  <span className="material-symbols-outlined">public</span>
                  <span>View Public Site</span>
                </Link>
                <Link
                  to="/admin/resume"
                  className="bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-bold py-3 px-2 rounded border border-white/5 transition-colors flex flex-col items-center space-y-2 text-center"
                >
                  <span className="material-symbols-outlined">edit</span>
                  <span>Edit Resume</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic inquiry feed */}
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Database Additions */}
          <div className="col-span-6 glass-panel rounded-xl overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="font-headline-md text-xl text-on-surface">Registered Core Milestones</h3>
              <span className="text-indigo-400 font-label-mono text-[10px] uppercase">DYNAMIC DB SEED</span>
            </div>
            <div className="p-8 space-y-6">
              {experiences && experiences.length > 0 ? (
                experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="flex space-x-4 relative border-l border-white/10 pl-6 pb-2">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-body-base font-bold text-on-surface text-sm">{exp.role_title}</h4>
                        <span className="text-slate-500 font-label-mono text-[9px]">
                          {exp.employment_type?.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{exp.company_name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 py-4 text-center">No experience milestones registered in DB.</p>
              )}
            </div>
          </div>

          {/* Real-time Inbound Leads / Contact Messages */}
          <div className="col-span-6 glass-panel rounded-xl overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="font-headline-md text-xl text-on-surface">Active Inquiries (Real-Time)</h3>
              <span className="bg-indigo-500 text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {newInquiriesCount} NEW
              </span>
            </div>
            <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto custom-scrollbar">
              {loadingInquiries && <p className="p-6 text-slate-500 text-sm text-center">Loading inbox inquiries...</p>}
              {inquiries && inquiries.length > 0 ? (
                inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                        {inq.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                            {inq.name}
                          </p>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400 font-mono mt-0.5">{inq.email}</p>
                        <p className="text-xs text-white font-bold mt-2">{inq.subject || "No Subject"}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">"{inq.message}"</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">mail</span>
                  <p className="text-sm text-slate-500">Your dynamic inbox is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
