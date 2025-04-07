import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/categories/featured`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch featured categories' },
        { status: response.status }
      );
    }
    
    const categories = await response.json();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch featured categories' },
      { status: 500 }
    );
  }
}