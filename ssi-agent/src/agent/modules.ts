import { AnonCredsCredentialFormatService, AnonCredsModule, AnonCredsProofFormatService, AnonCredsRegistry, BasicTailsFileService } from "@credo-ts/anoncreds";
import { Agent, AutoAcceptCredential, AutoAcceptProof, ConnectionsModule, CredentialsModule, DidResolver, DidsModule, ProofsModule, V2CredentialProtocol, V2ProofProtocol } from "@credo-ts/core";
import { IndyVdrAnonCredsRegistry, IndyVdrIndyDidRegistrar, IndyVdrIndyDidResolver, IndyVdrModule } from "@credo-ts/indy-vdr";
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { AskarModule, AskarMultiWalletDatabaseScheme } from '@credo-ts/askar';
import { indyVdr } from "@hyperledger/indy-vdr-nodejs";
import { bcovrinTest, indicioDemo } from "../utils/network";
// import { DbAnonCredsRegistry, DbDidRegistrar, DbDidResolver } from "did_db";
// import { FabricAnonCredsRegistry, FabricDidRegistrar, FabricDidResolver } from "did_fabric";
// import {FullTailsFileService} from "./utils/FullTailsFileService"


export function baseAgentModule() {

    const did_db_api = process.env.DID_DB_API;
    const did_fabric_api = process.env.DID_FABRIC_API;
    // const dbRegistry: unknown = new DbAnonCredsRegistry(did_db_api as string);
    // const fabrciRegistry: unknown = new FabricAnonCredsRegistry(did_fabric_api as string);
    const tailsServerBaseUrl = process.env.TAILS_SERVER_URL;

    // const tailsFileService = new BasicTailsFileService({
    //     tailsDirectoryPath: './tails',
    //     tailsServerBaseUrl: 'http://localhost:6543',
    // });

    return {
        connections: new ConnectionsModule({
            autoAcceptConnections: true,
        }),
        anoncreds: new AnonCredsModule({
            registries: [new IndyVdrAnonCredsRegistry()],
            // tailsFileService: new FullTailsFileService({
            //     tailsDirectoryPath: '.',
            //     tailsServerBaseUrl: tailsServerBaseUrl,
            // }),
            anoncreds
        }),
        indyVdr: new IndyVdrModule({
            indyVdr,
            networks: [bcovrinTest],
          }),
        dids: new DidsModule({
            resolvers: [new IndyVdrIndyDidResolver()],
            registrars: [new IndyVdrIndyDidRegistrar()],
        }),
        askar: new AskarModule({
            ariesAskar,
            multiWalletDatabaseScheme: AskarMultiWalletDatabaseScheme.ProfilePerWallet,
        }),
        
        credentials: new CredentialsModule({
            autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
            credentialProtocols: [
                new V2CredentialProtocol({
                    credentialFormats: [
                        new AnonCredsCredentialFormatService(),
                    ],
                }),
            ],
        }),
        proofs: new ProofsModule({
            autoAcceptProofs: AutoAcceptProof.ContentApproved,
            proofProtocols: [
                new V2ProofProtocol({
                    proofFormats: [
                        new AnonCredsProofFormatService(),],
                }),
            ],
        })
    } as const
}

export type AgentModules = Agent<ReturnType<typeof baseAgentModule>>;
