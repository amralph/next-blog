import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, displayName, oldDisplayName } = await req.json();

  const displayNameRegex = /^[a-zA-Z0-9]+$/;

  if (!displayNameRegex.test(displayName)) {
    return NextResponse.json('Error', {
      status: 400,
    });
  }

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
          UpdateExpression: 'SET displayName = :displayName',
          ExpressionAttributeValues: {
            ':displayName': displayName,
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
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: 'Failed to register display name' },
      { status: 500 }
    );
  }
}
