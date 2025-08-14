import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { assetId, amountIn, amount } = body;

  // simple mock logic
  const rateMap: Record<string, number> = {
    svc: 0.004,
    btc: 27000,
    eth: 1800,
    usdc: 1,
  };

  const rate = rateMap[assetId] || 100;
  const amtFiat = amountIn === "fiat" ? amount : amount * rate;
  const amtCrypto = amountIn === "crypto" ? amount : amount / rate;

  const quote = {
    id: crypto.randomUUID(),
    asset: { id: assetId, symbol: assetId.toUpperCase(), name: assetId.toUpperCase() },
    rate,
    amtFiat,
    amtCrypto,
    fees: { platform: 10, network: 5 },
    expiresAt: new Date(Date.now() + 30000).toISOString(), // 30s expiry
  };

  return NextResponse.json(quote);
}
