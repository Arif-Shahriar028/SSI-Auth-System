import { BaseAgent } from "../agent/baseAgent";

export const registerCredDef = async (agent: BaseAgent, agentDid: string, schemaId: string): Promise<string | undefined> => {
  try{
    //* checking existing credentialDefinition
    const existingCredDef = await agent.getCredentialDefinition(undefined, {schemaId, issuerId: agentDid, tag: "E-Shop account credential"})
    let credentialDefinitionId: string;
    if(existingCredDef.length > 0){
      console.log('credDef found: ', JSON.stringify(existingCredDef[0].credentialDefinitionId));
      credentialDefinitionId = existingCredDef[0].credentialDefinitionId;
    }

    //* if not found, create new credentialDefinition
    else{
      const credDefResp = await agent.createCredentialDefinition(
        agentDid,
        schemaId,
        "E-Shop account credential"
      );
      console.log(credDefResp);
      if (credDefResp.credentialDefinitionState.state !== "finished") {
        throw new Error(
          "Credential definition creation error: " + JSON.stringify(credDefResp)
        );
      }
      credentialDefinitionId =
        credDefResp.credentialDefinitionState.credentialDefinitionId;
    }

    return credentialDefinitionId;
  }catch(e){
    return;
  }
}