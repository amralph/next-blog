import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, postText } = await req.json();

  const createdAt = Date.now();

  const command = new PutCommand({
    TableName: 'posts',
    Item: { userId: sub, createdAt, postText },
  });

  try {
    await dynamoDb.send(command);
    return NextResponse.json(
      {
        message: 'post created',
      },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    console.error('Failed to create post', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500, statusText: 'Failed to create post' }
    );
  }
}
