// app/api/quotes/[id]/commit/route.ts
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const quoteId = params.id;

  // Mock payment session
  const paymentSession = {
    id: "mock-session-" + quoteId,
    quoteId,
    psp: "mock-psp",
    clientSecret: "mock-client-secret",
    redirectUrl: "https://mock-psp.com/pay",
  };

  return NextResponse.json({ paymentSession });
}
