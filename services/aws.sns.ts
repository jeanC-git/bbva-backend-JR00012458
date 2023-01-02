import AWS from 'aws-sdk';

export const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
}

export const makeRandString = (length: number) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const sendSMS = async (phone_number: string, message: string) => {
    const params = {
        Message: message,
        PhoneNumber: phone_number,
        // TopicArn: `arn:aws:sns:us-east-1:530226448921:BBVA-test`
    };

    try {

        const respMsg = await new AWS.SNS({ apiVersion: '2010-03-31' })
            .publish(params)
            .promise();

        // console.log(`SMS SENDED to ${phone_number} - ${message}`, { respMsg });


        return true;

    } catch (err) {
        console.log({ err });
        return false;
    }
}