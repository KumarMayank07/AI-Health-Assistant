import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6"><h3 className="font-semibold">Total users</h3><p className="text-sm text-muted-foreground mt-2">Connect Supabase to show metrics.</p></Card>
        <Card className="p-6"><h3 className="font-semibold">Documents</h3><p className="text-sm text-muted-foreground mt-2">Upload research for chatbot RAG.</p></Card>
        <Card className="p-6"><h3 className="font-semibold">Chat sessions</h3><p className="text-sm text-muted-foreground mt-2">History and moderation here.</p></Card>
      </div>
      <Card className="p-6">
        <h3 className="font-semibold">Model configuration</h3>
        <p className="text-sm text-muted-foreground mt-2">After connecting Supabase, we’ll add upload, delete, and embedding jobs.</p>
      </Card>
    </div>
  );
}
