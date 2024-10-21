import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const { sub, displayName, oldDisplayName } = await req.json();

  const displayNameRegex = /^[a-zA-Z0-9]+$/;

  if (!displayNameRegex.test(displayName)) {
    return NextResponse.json(
      { error: 'invalid displayName' },
      {
        status: 400,
        statusText: 'invalid displayName',
      }
    );
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
    return NextResponse.json(
      {
        message: 'displayName updated',
      },
      {
        status: 200,
        statusText: 'OK',
      }
    );
  } catch (error) {
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: 'Failed to register display name' },
      { status: 500, statusText: 'Failed to register display name' }
    );
  }
}
