import { NextResponse } from 'next/server';
import dynamoDb from '@/lib/dynamodb'; // Adjust the path as necessary
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function GET() {
  const params = {
    TableName: 'users', // Ensure this matches your DynamoDB table name
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command); // Use the send method with the command
    return NextResponse.json(data.Items); // Return the users as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
