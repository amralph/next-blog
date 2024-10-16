import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/dynamodb'; // Adjust the path as necessary
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, displayName, birthday, bio } = await req.json();
  const params = {
    TableName: 'users',
    Key: {
      userID: sub,
    },
    UpdateExpression:
      'SET displayName = :displayName, birthday = :birthday, bio = :bio',
    ExpressionAttributeValues: {
      ':displayName': displayName,
      ':birthday': birthday,
      ':bio': bio,
    },
  };
  try {
    const command = new UpdateCommand(params);
    const data = await dynamoDb.send(command);
    return NextResponse.json({
      message: 'User updated successfully',
      updatedAttributes: data.Attributes,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
