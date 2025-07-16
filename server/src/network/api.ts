
const agent_server = process.env.AGENT_API_URL || "http://localhost:4000";

const route = (url: string) => `${agent_server}${url}`;

export const createInvitation = route('/create-invitation');
export const getConnectionResult = (oobId: string) => route(`/connections?outOfBandId=${oobId}`);
export const issueCredential = route('/issue-credential');
export const revokeCredential = route('/revoke-credential');
export const sendProofRequest = route('/send-proof-request');
export const getProofRecords = route('/get-proof-records')
export const getProofData = (proofRecordId: string) =>  route(`/proof-data/${proofRecordId}`)

export const notifyToWallet = 'http://localhost:6000/webhook/websocket'