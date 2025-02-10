
export function sendOTP(otp: string, phoneNumber: string) {
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

export function isPhoneNo(phoneNumber: string) {
    // Remove any whitespace, hyphens, or '+' from the input
    const cleanNumber = phoneNumber.replace(/[\s\-\+]/g, '');

    // Three possible formats:
    // 1. Starting with '01' (local format): 11 digits total
    // 2. Starting with '880' (international format without '+'): 13 digits total
    // 3. Starting with '+880' (international format with '+'): 13 digits total
    const bdPhoneRegex = /^(?:(?:\+?880)|0)1[3-9]\d{8}$/;

    return bdPhoneRegex.test(cleanNumber);
}

export const parsePhoneNumber = (phoneNumber: string) => {
    const numStr = phoneNumber.toString();
    if (numStr.startsWith('88')) return numStr;
    if (numStr.startsWith('01')) return `88${numStr}`;
    return `88${numStr}`;
}