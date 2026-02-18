export type InventoryCondition = "New" | "Used";

export type InventoryScope = {
  organizationId: string;
  locationId: string;
};

export type InventoryListItem = {
  id: string;
  item: string;
  condition: InventoryCondition;
  size: string;
  price: number;
  qty: number;
  updatedAt: Date;
};

export type CreateInventoryInput = {
  item: string;
  condition: InventoryCondition;
  size: string;
  price: number;
  qty: number;
};

export type UpdateInventoryQtyInput = {
  id: string;
  qty: number;
};
