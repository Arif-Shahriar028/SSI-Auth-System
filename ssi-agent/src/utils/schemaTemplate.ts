export const schemaFormat = (agentDid: string) => {
  return {
    name: "EShop Account Credentials",
    version: process.env.SCHEMA_VERSION || '',
    attrNames: ["name", "email", "phone"],
    issuerId: agentDid,
  }
};