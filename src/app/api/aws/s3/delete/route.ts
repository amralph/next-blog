import s3 from '@/lib/aws/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const getS3KeyFromUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    const key = parsedUrl.pathname.substring(1); // Removes the leading "/"

    return key;
  } catch (error) {
    throw new Error('Invalid S3 URL');
  }
};

export async function POST(req: NextRequest) {
  // Read the incoming stream
  const data = await req.json();
  const fileUrl = data.fileUrl;

  if (!fileUrl) {
    return NextResponse.json(
      { error: 'No file URL provided' },
      {
        status: 400,
        statusText: 'No file URL provided',
      }
    );
  }

  // upload to s3...
  try {
    // Prepare S3 upload parameters
    const key = getS3KeyFromUrl(fileUrl);

    // Prepare S3 delete parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(params));

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200, statusText: 'OK' }
    );
  } catch (deleteError) {
    console.error('Error deleting from S3:', deleteError);

    return NextResponse.json(
      { error: 'Error deleting from S3' },
      { status: 500, statusText: 'Error deleting from S3' }
    );
  }
}
