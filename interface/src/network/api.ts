
const server_url = process.env.SERVER_API_URL || "http://localhost:9009";

const route = (url: string) => `${server_url}/${url}`;

export const checkEmail = (email: string) => route(`auth/check/${email}`);
export const getConnectionInvitation = route(`connection/create-invitation`);
export const sendOtp =  route(`otp/send`);
export const verifyOtp = route(`otp/verify`);
export const issueCredential = route(`credential/issue`);
export const sendProofRequest = route(`proof/send-request`);
export const verifyUser = route(`auth/verify`);