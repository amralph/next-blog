import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/aws/dynamodb'; // Adjust the path as necessary
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function GET() {
  const params = {
    TableName: 'posts',
    Limit: 10,
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    const posts = data.Items;

    const userIds = new Set(posts?.map((post) => post.userId));

    const promises = [];

    // Loop through userIds and prepare fetch requests
    for (const userId of Array.from(userIds)) {
      const fetchPromise = fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/users/getUserById?userId=${userId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error fetching user ${userId}: ${response.statusText}`
            );
          }
          return response.json();
        })
        .catch((error) => {
          console.error(error);
          return null;
        });

      promises.push(fetchPromise);
    }

    const users = await Promise.all(promises);

    return NextResponse.json(
      { posts, users },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500, statusText: 'Failed to fetch posts' }
    );
  }
}
