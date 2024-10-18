import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, birthday, bio } = await req.json();

  // Define the transaction with optional Delete operation if oldDisplayName exists
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
    return NextResponse.json({
      message: 'User updated successfully and display name registered',
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
