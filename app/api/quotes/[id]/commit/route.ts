// app/api/quotes/[id]/commit/route.ts
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: { [key: string]: string } } // <-- use string index signature
) {
  const quoteId = context.params.id;

  const paymentSession = {
    id: "mock-session-" + quoteId,
    quoteId,
    psp: "mock-psp",
    clientSecret: "mock-client-secret",
    redirectUrl: "https://mock-psp.com/pay",
  };

  return NextResponse.json({ paymentSession });
}
