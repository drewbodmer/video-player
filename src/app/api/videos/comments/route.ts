import { NextResponse } from 'next/server';
import { EXTERNAL_API_URL } from '@/lib/api/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const video_id = searchParams.get('video_id');

  const response = await fetch(`${EXTERNAL_API_URL}/videos/comments?video_id=${video_id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const requestData = await request.json();

  const response = await fetch(`${EXTERNAL_API_URL}/videos/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();
  return NextResponse.json(data);
}