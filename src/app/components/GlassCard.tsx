export default function GlassCard({ children }: { children: React.ReactNode }) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/10">
        {children}
      </div>
    );
  }