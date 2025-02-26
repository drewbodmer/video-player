import { NextResponse } from 'next/server';
import { EXTERNAL_API_URL } from '@/lib/api/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  const response = await fetch(`${EXTERNAL_API_URL}/videos?user_id=${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const requestData = await request.json();

  const response = await fetch(`${EXTERNAL_API_URL}/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();
  return NextResponse.json(data);
}