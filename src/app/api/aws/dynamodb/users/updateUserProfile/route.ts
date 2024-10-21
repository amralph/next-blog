import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, birthday, bio } = await req.json();

  const transactParams = {
    TransactItems: [
      {
        Update: {
          TableName: 'users',
          Key: {
            userId: sub,
          },
          UpdateExpression: 'SET birthday = :birthday, bio = :bio',
          ExpressionAttributeValues: {
            ':birthday': birthday,
            ':bio': bio,
          },
        },
      },
    ],
  };

  try {
    // Execute the transaction
    const command = new TransactWriteCommand(transactParams);
    await dynamoDb.send(command);
    return NextResponse.json(
      {
        message: 'user updated',
      },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500, statusText: 'Failed to update user' }
    );
  }
}
