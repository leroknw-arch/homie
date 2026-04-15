import { FolderX } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export default function CampaignNotFound() {
  return (
    <EmptyState
      icon={<FolderX className="size-6" />}
      title="Campaign not found"
      description="The requested campaign does not exist in the current HOMIE workspace."
    />
  );
}
