
export function sendOTP(otp: string, phoneNumber:string) {
    const API_KEY = process.env.SMS_API_KEY;
    const SMS_SENDERID = process.env.SMS_SENDERID;
    const url = "http://bulksmsbd.net/api/smsapi?";
    const urlParam = new URLSearchParams({
        api_key: API_KEY as string,
        type: 'text',
        number: phoneNumber,
        senderid: SMS_SENDERID as string,
         message: `Your Shahajjo verification code is ${otp}. Please do not share your OTP or PIN with others.`,
    });
    return fetch(url + urlParam.toString());
}

export function isPhoneNo(phoneNumber:string) {
    const numStr = phoneNumber.toString();
    // Regular expression to check if the number is 13 digits long and starts with '01'
    const phoneRegex = /^88\d{11}$/;
    return phoneRegex.test(numStr);
}

export const parsePhoneNumber = (phoneNumber: string) => {
    const numStr = phoneNumber.toString();
    if (numStr.startsWith('88')) return numStr;
    if (numStr.startsWith('01')) return `88${numStr}`;
    return `88${numStr}`;
}