export type CustomerScope = {
  organizationId: string;
};

export type CustomerListItem = {
  id: string;
  name: string;
  phone: string;
  phoneDigits: string;
  lastVisitAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerQuickSummary = {
  id: string;
  name: string;
  phone: string;
  phoneDigits: string;
  lastVisitAt: string | null;
};

export type CreateCustomerInput = {
  name: string;
  phone: string;
  phoneDigits: string;
};
