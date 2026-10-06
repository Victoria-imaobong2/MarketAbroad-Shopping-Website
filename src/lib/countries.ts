export type DeliveryZone = "DOMESTIC" | "ZONE_1" | "ZONE_2" | "REST_OF_WORLD";

export interface CountryOption {
  code: string;
  name: string;
  sameDayAvailable: boolean;
  zone: DeliveryZone;
}

export const ALL_COUNTRIES = [
  { code: "GB", name: "United Kingdom", sameDayAvailable: true, zone: "ZONE_1" },
  { code: "US", name: "United States", sameDayAvailable: true, zone: "ZONE_2" },
  { code: "CA", name: "Canada", sameDayAvailable: true, zone: "ZONE_2" },
  { code: "IE", name: "Ireland", sameDayAvailable: true, zone: "ZONE_1" },
  { code: "DE", name: "Germany", sameDayAvailable: true, zone: "ZONE_2" },
  { code: "NG", name: "Nigeria", sameDayAvailable: true, zone: "DOMESTIC" },
  { code: "AU", name: "Australia", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "AT", name: "Austria", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "BE", name: "Belgium", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "BR", name: "Brazil", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "CH", name: "Switzerland", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "CY", name: "Cyprus", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "DK", name: "Denmark", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "ES", name: "Spain", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "FI", name: "Finland", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "FR", name: "France", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "GH", name: "Ghana", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "IT", name: "Italy", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "JP", name: "Japan", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "KE", name: "Kenya", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "NL", name: "Netherlands", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "NO", name: "Norway", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "NZ", name: "New Zealand", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "PL", name: "Poland", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "PT", name: "Portugal", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "SE", name: "Sweden", sameDayAvailable: false, zone: "ZONE_2" },
  { code: "ZA", name: "South Africa", sameDayAvailable: false, zone: "REST_OF_WORLD" },
  { code: "AE", name: "United Arab Emirates", sameDayAvailable: false, zone: "REST_OF_WORLD" },
] as const satisfies readonly CountryOption[];