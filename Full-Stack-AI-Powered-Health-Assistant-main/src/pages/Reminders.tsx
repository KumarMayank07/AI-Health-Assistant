import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Reminders() {
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold">Reminders</h1>
      <Card className="p-6 max-w-xl">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Metformin 500mg" />
          </div>
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input type="datetime-local" />
          </div>
          <div className="py-2">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Save reminder
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
