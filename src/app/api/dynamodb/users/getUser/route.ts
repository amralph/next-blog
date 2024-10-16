import { NextResponse, NextRequest } from 'next/server';
import dynamoDb from '@/lib/dynamodb'; // Adjust the path as necessary
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userID = searchParams.get('userID');

  if (!userID) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const params = {
    TableName: 'users', // Ensure this matches your DynamoDB table name
    Key: {
      userID: userID,
    },
  };

  try {
    const command = new GetCommand(params);
    const data = await dynamoDb.send(command); // Use the send method with the command

    if (!data.Item) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } else {
      return NextResponse.json(data.Item); // Return the users as a JSON response
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
