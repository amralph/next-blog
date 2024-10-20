import { NextResponse, NextRequest } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb'; // Adjust the path as necessary
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const displayName = searchParams.get('displayName');

  if (!displayName) {
    return NextResponse.json(
      { error: 'displayName is required' },
      { status: 400, statusText: 'displayName is required' }
    );
  }

  const displayNameParams = {
    TableName: 'displayNames', // Ensure this matches your DynamoDB table name
    Key: {
      displayName: displayName,
      displayNameLower: displayName.toLowerCase(),
    },
  };
  try {
    const displayNameCommand = new GetCommand(displayNameParams);
    const displayNameData = await dynamoDb.send(displayNameCommand); // Use the send method with the command

    if (!displayNameData.Item) {
      return NextResponse.json(
        { error: 'Display name not found' },
        { status: 404, statusText: 'Display name not found' }
      );
    }

    // Now we have the userId from the displayNames table
    const userId = displayNameData.Item.userId;

    // Now query the users table using the userId
    const userParams = {
      TableName: 'users',
      Key: {
        userId: userId,
      },
    };

    const userCommand = new GetCommand(userParams);
    const userData = await dynamoDb.send(userCommand);

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
      );
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500, statusText: 'Failed to fetch user details' }
    );
  }
}
