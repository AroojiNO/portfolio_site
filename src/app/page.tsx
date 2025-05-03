import GlassCard from "./components/GlassCard";

export default function Home() {
  return (
    <main className="min-h-screen px-8 py-12 bg-gradient-to-br from-primary via-dark to-accent text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <div className="bg-dark text-accent p-4 rounded-xl">This is a test block</div>
      <GlassCard>
        <p>This is your home page. You can introduce yourself here.</p>
      </GlassCard>
    </main>
  );
}