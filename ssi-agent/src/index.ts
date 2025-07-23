import express from "express";
import { BaseAgent } from "./agent/baseAgent";
import cors from "cors";
import dotenv from "dotenv";
import { initializeAgent } from './agent/initialize';
import all_routes from './routes/all.routes'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const init = async () => {

  const port = Number(process.env.ISSUER_API_PORT) || 9000;
  const agentPublicEndpoint = process.env.ISSUER_AGENT_PUBLIC_ENDPOINT || `http://localhost:${port}`;
  const agentLabel = process.env.ISSUER_AGENT_LABEL || "MyAgent";

  const agent: BaseAgent | undefined = await initializeAgent(port, agentPublicEndpoint, agentLabel);

  app.use('/', all_routes(agent))
  
  
  app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

init()
