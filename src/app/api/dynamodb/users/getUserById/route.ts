import { NextResponse, NextRequest } from 'next/server';
import dynamoDb from '@/lib/dynamodb'; // Adjust the path as necessary
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400, statusText: 'userId is required' }
    );
  }

  const params = {
    TableName: 'users', // Ensure this matches your DynamoDB table name
    Key: {
      userId: userId,
    },
  };

  try {
    const command = new GetCommand(params);
    const userData = await dynamoDb.send(command); // Use the send method with the command

    if (!userData.Item) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } else {
      return NextResponse.json(
        {
          displayName: userData.Item.displayName,
          email: userData.Item.email,
          bio: userData.Item.bio,
          birthday: userData.Item.birthday,
        },
        { status: 200, statusText: 'OK' }
      ); // Return the users as a JSON response
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500, statusText: 'Failed to fetch users' }
    );
  }
}
