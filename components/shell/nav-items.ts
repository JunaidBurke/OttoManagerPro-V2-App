export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  subtitle: string;
};

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    href: "/",
    label: "Dashboard",
    shortLabel: "Home",
    subtitle: "Today and quick actions"
  },
  {
    href: "/customers",
    label: "Customers",
    shortLabel: "Customers",
    subtitle: "Profiles and service history"
  },
  {
    href: "/vehicles",
    label: "Vehicles",
    shortLabel: "Vehicles",
    subtitle: "Mileage and service timeline"
  },
  {
    href: "/inventory",
    label: "Inventory",
    shortLabel: "Stock",
    subtitle: "Tire stock, size, and pricing"
  },
  {
    href: "/reminders",
    label: "Reminders",
    shortLabel: "Reminders",
    subtitle: "Upcoming, due, and overdue"
  }
];
