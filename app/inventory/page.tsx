import { InventoryTable } from "@/components/inventory/inventory-table";
import { PageFrame } from "@/components/shell/page-frame";

export default function InventoryPage() {
  return (
    <PageFrame
      title="Inventory"
      description="Track tire stock by item, size, condition, and price for fast counter service."
    >
      <InventoryTable />
    </PageFrame>
  );
}
