export const schemaFormat = (agentDid: string) => {
  return {
    name: "BRACU Certificate",
    version: process.env.SCHEMA_VERSION || '',
    attrNames: ["name", "email", "phone"],
    issuerId: agentDid,
  }
};