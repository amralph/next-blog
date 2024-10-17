import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, displayName, birthday, bio, oldDisplayName } = await req.json();

  // Define the transaction with optional Delete operation if oldDisplayName exists
  const transactParams = {
    TransactItems: [
      {
        Put: {
          TableName: 'displayNames',
          Item: {
            displayName: displayName,
            displayNameLower: displayName.toLowerCase(),
            userId: sub,
          },
        },
      },
      {
        Update: {
          TableName: 'users',
          Key: {
            userId: sub,
          },
          UpdateExpression:
            'SET displayName = :displayName, birthday = :birthday, bio = :bio',
          ExpressionAttributeValues: {
            ':displayName': displayName,
            ':birthday': birthday,
            ':bio': bio,
          },
        },
      },
    ],
  };

  // If the user has an old display name, add a Delete action to the transaction
  if (oldDisplayName) {
    transactParams.TransactItems.unshift({
      Delete: {
        TableName: 'displayNames',
        Key: {
          displayName: oldDisplayName,
          displayNameLower: oldDisplayName.toLowerCase(),
        },
      },
    });
  }

  try {
    // Execute the transaction
    const command = new TransactWriteCommand(transactParams);
    await dynamoDb.send(command);
    return NextResponse.json({
      message: 'User updated successfully and display name registered',
    });
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return NextResponse.json(
        { error: 'Display name is already taken' },
        { status: 400 }
      );
    }

    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: 'Failed to update user and register display name' },
      { status: 500 }
    );
  }
}
