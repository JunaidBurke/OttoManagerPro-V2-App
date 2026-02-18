export const OTTO_LOCATION_COOKIE_NAME = "otto_location_id";

export type OrgLocation = {
  id: string;
  name: string;
  isActive: boolean;
};

export type LocationContext = {
  organizationId: string;
  activeLocation: OrgLocation | null;
  locations: OrgLocation[];
};
