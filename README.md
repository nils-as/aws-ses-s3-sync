# aws-ses-s3-sync

Sync AWS Simple Email Service (SES) email template files automatically from your AWS Simple Storage Service (S3) bucket.

1. Create S3 bucket
2. Create Lambda function
3. Add S3 two triggers to Lambda function (S3: all write operations; S3: all delete operations)
4. Write the Lambda function (see index.js)
5. Set up SES (see documentation)
6. Upload <template-id>.json to S3 bucket.
7. Check in SES console --> Email templates if sync was successful.
