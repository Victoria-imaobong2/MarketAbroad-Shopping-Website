export type CurrencyCode = "USD" | "NGN" | "GBP" | "EUR" | "CAD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number; // 1 USD = rateFromUSD
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rateFromUSD: 1.0, locale: "en-US" },
  NGN: { code: "NGN", symbol: "₦", rateFromUSD: 1550.0, locale: "en-NG" }, // Update to your target FX rate
  GBP: { code: "GBP", symbol: "£", rateFromUSD: 0.78, locale: "en-GB" },
  EUR: { code: "EUR", symbol: "€", rateFromUSD: 0.92, locale: "de-DE" },
  CAD: { code: "CAD", symbol: "CA$", rateFromUSD: 1.36, locale: "en-CA" },
};

export function convertAmount(amountInUSD: number, toCurrency: CurrencyCode): number {
  const rate = CURRENCIES[toCurrency].rateFromUSD;
  return amountInUSD * rate;
}

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency];
  return `${config.symbol}${amount.toLocaleString(config.locale, {
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  })}`;
}