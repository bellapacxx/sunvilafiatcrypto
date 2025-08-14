import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const wallets = [
    {
      id: "wallet1",
      asset: { id: "btc", symbol: "BTC", name: "Bitcoin" },
      totalBalance: 0.5,
      availableBalance: 0.4,
      depositAddresses: [{ address: "bc1qmockbtcaddress" }],
    },
    {
      id: "wallet2",
      asset: { id: "eth", symbol: "ETH", name: "Ethereum" },
      totalBalance: 2,
      availableBalance: 1.8,
      depositAddresses: [{ address: "0xmockethaddress" }],
    },
    {
      id: "wallet3",
      asset: { id: "usdc", symbol: "USDC", name: "USD Coin" },
      totalBalance: 1000,
      availableBalance: 900,
      depositAddresses: [{ address: "0xmockusdcaddress" }],
    },
  ];

  return NextResponse.json(wallets);
}
