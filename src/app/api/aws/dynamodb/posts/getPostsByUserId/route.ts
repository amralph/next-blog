import { NextRequest, NextResponse } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb'; // Adjust the path as necessary
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId parameter' },
      { status: 400, statusText: 'Missing userId parameter' }
    );
  }

  const params = {
    TableName: 'posts',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    Limit: 10,
    ScanIndexForward: false,
  };

  try {
    const command = new QueryCommand(params);
    const data = await dynamoDb.send(command);

    return NextResponse.json(
      { posts: data.Items },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500, statusText: 'Failed to fetch posts' }
    );
  }
}
