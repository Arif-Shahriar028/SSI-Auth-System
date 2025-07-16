import { AnonCredsSchema } from "@credo-ts/anoncreds";
import { BaseAgent } from "../agent/baseAgent";

export const registerSchema = async (agent: BaseAgent, agentDid: string, schemaTemplate: AnonCredsSchema): Promise<string | undefined> => {
  try{
    //* checking existing schema
    const existingSchema = await agent.getSchema(undefined, schemaTemplate, agentDid);
    let schemaId: string;

    if(existingSchema.length > 0) {
      console.log('schema found: ', JSON.stringify(existingSchema[0].schemaId));
      schemaId = existingSchema[0].schemaId;
    }
    
    //* if not found, create new schema
    else{
      const schemaResp = await agent.createSchema(agentDid, schemaTemplate);
      
      if (schemaResp.schemaState.state !== "finished") {
        throw new Error("Schema creation error: " + JSON.stringify(schemaResp));
      }
      schemaId = schemaResp.schemaState.schemaId;
    }

    return schemaId;
  }catch(e){
    return;
  }
}