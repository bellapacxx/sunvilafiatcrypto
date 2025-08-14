// app/api/quotes/[id]/commit/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id: quoteId } = await params;

  // Mock payment session
  const paymentSession = {
    id: `mock-session-${quoteId}`,
    quoteId,
    psp: 'mock-psp',
    clientSecret: 'mock-client-secret',
    redirectUrl: 'https://mock-psp.com/pay',
  };

  return NextResponse.json({ paymentSession });
}
