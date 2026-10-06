import { CountryOption, DeliveryZone } from "./countries";
import { CurrencyCode, convertAmount } from "./currencies";

export interface FeeBreakdown {
  subtotal: number;
  shippingFee: number;
  packagingFee: number;
  total: number;
  currency: CurrencyCode;
}

// Flat base rates by delivery zone in USD ($)
const BASE_ZONE_RATES_USD: Record<DeliveryZone, number> = {
  DOMESTIC: 3.5,
  ZONE_1: 22.0,
  ZONE_2: 28.0,
  REST_OF_WORLD: 38.0,
};

// Additional per-item surcharge in USD ($)
const PER_ITEM_SURCHARGE_USD: Record<DeliveryZone, number> = {
  DOMESTIC: 0.5,
  ZONE_1: 2.0,
  ZONE_2: 2.5,
  REST_OF_WORLD: 3.5,
};

export function calculateOrderFees({
  itemsSubtotalNGN,
  itemCount,
  country,
  isExpress = false,
  displayCurrency = "USD",
}: {
  itemsSubtotalNGN: number;
  itemCount: number;
  country: CountryOption | undefined;
  isExpress?: boolean;
  displayCurrency?: CurrencyCode;
}): FeeBreakdown {
  const ngnToUsdRate = 1 / 1550;
  const subtotalUSD = itemsSubtotalNGN * ngnToUsdRate;

  if (!country || itemCount === 0) {
    const total = convertAmount(subtotalUSD, displayCurrency);
    return {
      subtotal: total,
      shippingFee: 0,
      packagingFee: 0,
      total,
      currency: displayCurrency,
    };
  }

  const baseRateUSD = BASE_ZONE_RATES_USD[country.zone];
  const surchargeUSD = PER_ITEM_SURCHARGE_USD[country.zone] * Math.max(0, itemCount - 1);
  let shippingUSD = baseRateUSD + surchargeUSD;

  if (isExpress && country.sameDayAvailable) {
    shippingUSD += 8.0;
  }

  const packagingUSD = 2.0;

  const convertedSubtotal = convertAmount(subtotalUSD, displayCurrency);
  const convertedShipping = convertAmount(shippingUSD, displayCurrency);
  const convertedPackaging = convertAmount(packagingUSD, displayCurrency);

  return {
    subtotal: convertedSubtotal,
    shippingFee: convertedShipping,
    packagingFee: convertedPackaging,
    total: convertedSubtotal + convertedShipping + convertedPackaging,
    currency: displayCurrency,
  };
}