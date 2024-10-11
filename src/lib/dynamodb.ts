// lib/aws.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Create a DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION as string, // Ensure this environment variable is set
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string, // AWS Access Key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string, // AWS Secret Access Key
  },
});

// Create a Document Client for simplified data operations
const dynamoDB = DynamoDBDocumentClient.from(client);

export default dynamoDB;
