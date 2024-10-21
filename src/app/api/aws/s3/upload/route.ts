import s3 from '@/lib/aws/s3';
import { Upload } from '@aws-sdk/lib-storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  // Read the incoming stream
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const folder = formData.get('folder');

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      {
        status: 400,
        statusText: 'No file uploaded',
      }
    );
  }

  // upload to s3...
  try {
    // Prepare S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${folder}/${uuidv4()}_${Date.now()}_${file.name}`, // add uuid to this...
      Body: file.stream(), // Use the stream directly for the upload
      ContentType: file.type,
    };

    // Upload the file to S3
    const upload = new Upload({
      client: s3,
      params,
    });

    const result = await upload.done();

    return NextResponse.json(
      { url: result.Location },
      { status: 200, statusText: 'OK' }
    );
  } catch (uploadError) {
    return NextResponse.json(
      { error: 'Error uploading to S3' },
      { status: 500, statusText: 'Error uploading to S3' }
    );
  }
}
