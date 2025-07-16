import { schemaFormat } from '../utils/schemaTemplate';
import { BaseAgent } from "./baseAgent";
import { registerSchema } from '../utils/schema';
import { registerCredDef } from '../utils/credDef';

let agent: BaseAgent;

export const initializeAgent = async (port: number, agentPublicEndpoint: string, agentLabel: string): Promise<BaseAgent> => {
  try {
    const agentDid: string = process.env.ISSUER_DID!;
    const agentSeed: string = process.env.ISSUER_SEED!;
    let credentialDefinitionId: string = "";

    // Initialize the agent
    agent = new BaseAgent({
      port: port + 1,
      label: agentLabel,
      publicEndpoint: agentPublicEndpoint
    });


    await agent.init();


    console.log(
      `agent initialized successfully.`
    );

    await agent.importDid(agentDid, agentSeed);
    
    console.log("DID imported successfully.");

    const schemaTemplate = schemaFormat(agentDid)

    const schemaId = await registerSchema(agent, agentDid, schemaTemplate);

    if(schemaId){
      credentialDefinitionId = await registerCredDef(agent, agentDid, schemaId) || "";
    }

    agent.agentDid = agentDid;
    agent.agentSeed = agentSeed;
    agent.credentialDefinitionId = credentialDefinitionId;

  } catch (error) {
    console.error("Error initializing BaseAgent:", error);
  }finally{
    return agent;
  }
};