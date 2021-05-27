const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const ses = new aws.SES();

exports.handler = async(event, context) => {
    
    console.log(event);

    //Retrieve the object modified
    const bucket = event.Records[0].s3.bucket.name;
    const eventType = event.Records[0].eventName;
    console.log(eventType);
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log(key);

    //Extract template id from filename
    const templateId = key.substring(key.lastIndexOf("/")+1, key.indexOf("."));

    console.log(templateId);

    //Handle the event (added/updated or removed)
    if (eventType.includes("Removed")) {
        const params = {
            TemplateName: templateId
        };
        //Delete the template from SES
        const result = await ses.deleteTemplate(params).promise();
        console.log(result);
    }
    else {  //Template was added or updated
        
        const params = {
            Bucket: bucket,
            Key: key
        };

        //Get template data as binary array and parse it to JSON
        const data = await s3.getObject(params).promise();
        var str = data.Body.toString();
        var template = JSON.parse(str);
        console.log(template);
        
        try { //Try to create a new template on SES
            let res = await ses.createTemplate(template).promise();
            console.log(res);
        }
        catch (error) {
            //If template already exists, update it
            if (error.errorType === "AlreadyExists") {
                let res = await ses.updateTemplate(template).promise();
                console.log(res);
            }

        }
    }
    return;
};
