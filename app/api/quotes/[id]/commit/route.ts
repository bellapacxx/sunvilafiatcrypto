// app/api/quotes/[id]/commit/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  // Access params safely inside the function
  const quoteId = context.params.id;

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
