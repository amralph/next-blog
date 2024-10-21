import { NextRequest, NextResponse } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const userId = formData.get('userId');
  const oldProfilePictureUrl = formData.get('oldProfilePictureUrl');

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      {
        status: 400,
        statusText: 'No file uploaded',
      }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: 'No userId' },
      {
        status: 400,
        statusText: 'No userId',
      }
    );
  }

  try {
    // upload photo to s3
    const uploadPictureRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/s3/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (uploadPictureRes.status === 200) {
      const profilePictureData = await uploadPictureRes.json();
      const profilePictureUrl = profilePictureData.url;

      // update dynamodb user profilePictureUrl attribute
      const transactParams = {
        TransactItems: [
          {
            Update: {
              TableName: 'users',
              Key: {
                userId,
              },
              UpdateExpression: 'SET profilePictureUrl = :profilePictureUrl',
              ExpressionAttributeValues: {
                ':profilePictureUrl': profilePictureUrl,
              },
            },
          },
        ],
      };

      const command = new TransactWriteCommand(transactParams);
      await dynamoDb.send(command);

      if (oldProfilePictureUrl) {
        // delete old profile photo in s3 bucket if exists
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/s3/delete`,
          {
            method: 'POST',
            body: JSON.stringify({
              fileUrl: oldProfilePictureUrl,
            }),
          }
        );
      }

      return NextResponse.json(
        {
          message: 'user profile picture updated',
          profilePictureUrl,
        },
        { status: 200, statusText: 'OK' }
      );
    }
  } catch (error) {
    console.error('Failed to upload user profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload user profile picture' },
      { status: 500, statusText: 'Failed to upload user profile picture' }
    );
  }
}
