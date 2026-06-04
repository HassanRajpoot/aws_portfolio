export function MeshBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[10%] right-[-5%] h-[35%] w-[35%] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute right-[15%] top-[20%] h-[25%] w-[25%] animate-mesh rounded-full bg-purple-600/15 blur-[80px]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)",
        }}
      />
    </div>
  );
}
