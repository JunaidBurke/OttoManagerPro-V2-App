import { Suspense } from "react";
import { InventoryPanel } from "@/components/inventory/inventory-panel";
import { InventoryPanelSkeleton } from "@/components/inventory/inventory-panel-skeleton";
import { PageFrame } from "@/components/shell/page-frame";

export default function InventoryPage() {
  return (
    <PageFrame
      title="Inventory"
      description="Track tire stock by item, size, condition, and price for fast counter service."
    >
      <Suspense fallback={<InventoryPanelSkeleton />}>
        <InventoryPanel />
      </Suspense>
    </PageFrame>
  );
}
