import { NextRequest, NextResponse } from 'next/server';

// This would typically come from a database
let products = [
  {
    id: 1,
    name: 'Sample Product 1',
    description: 'This is a sample product description',
    price: 19.99,
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    name: 'Sample Product 2',
    description: 'Another sample product with details',
    price: 29.99,
    imageUrl: 'https://via.placeholder.com/300',
  },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      imageUrl: body.imageUrl || '',
    };

    products.push(newProduct);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}