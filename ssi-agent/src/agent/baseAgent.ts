import { Agent, BasicMessageEventTypes, BasicMessageRole, BasicMessageStateChangedEvent, ConnectionEventTypes, ConnectionStateChangedEvent, CredentialEventTypes, CredentialStateChangedEvent, DidRecord, HttpOutboundTransport, InitConfig, KeyType, ProofEventTypes, ProofStateChangedEvent, TypedArrayEncoder, utils, WsOutboundTransport } from "@credo-ts/core";
import { AgentModules, baseAgentModule } from "./modules";
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node';
import * as crypto from 'crypto'
import { AnonCredsSchema } from "@credo-ts/anoncreds";
import { AcceptInvitationOptions, AttributeElement, CreateInvitationOptions, GetConnectionsOptions, SendConnLessProofRequest, SendProofRequest } from "../types/anoncreds.types";
import { webhookCall } from "../utils/network-call";

export class BaseAgent {
    public port: number
    public label: string
    public credentialDefinitionId: string = "";
    public agentDid: string = "";
    public agentSeed: string = "";
    protected readonly config: InitConfig;
    protected endpoints: string[];
    protected agent: AgentModules;
    protected isInitialized: boolean = false;
    

    public constructor({
        port,
        label,
        publicEndpoint,
    }: {
        port: number,
        label: string,
        publicEndpoint: string,
        
    }) {
        this.port = port
        this.label = label
        this.endpoints = [publicEndpoint]

        this.config = {
            label: label,
            endpoints: this.endpoints,
            walletConfig: {
                key: "brac-university-certificate",
                id: `brac-university-certificate`,

            }
        } satisfies InitConfig
        this.agent = new Agent({
            config: this.config,
            dependencies: agentDependencies,
            modules: baseAgentModule(),

        })

        this.agent.registerInboundTransport(new HttpInboundTransport({ port }));
        this.agent.registerOutboundTransport(new HttpOutboundTransport());
        this.agent.registerOutboundTransport(new WsOutboundTransport());
    }

    public async init() {
        try {
            await this.agent.initialize();
            this.isInitialized = true;

            this.agent.events.on<ProofStateChangedEvent>(ProofEventTypes.ProofStateChanged, async (event) => {
                console.log(`Proof Record state: ${event.payload.proofRecord.state}`);
                if(event.payload.proofRecord.state === "done" || event.payload.proofRecord.state === "abandoned"){
                    await webhookCall({type: 'proof-state', payload: event.payload.proofRecord});
                }
            })

            this.agent.events.on(
                BasicMessageEventTypes.BasicMessageStateChanged,
                async (event: BasicMessageStateChangedEvent) => {
                    if (event.payload.basicMessageRecord.role === BasicMessageRole.Receiver) {
                        console.log(`Received message: ${event.payload.basicMessageRecord.content}`);
                    }
                },
            );
            this.agent.events.on<CredentialStateChangedEvent>(
                CredentialEventTypes.CredentialStateChanged,
                async (event) => {
                    console.log(`Credential Record State: ${event.payload.credentialRecord.state}`);
                    if(event.payload.credentialRecord.state === "done"){
                        await webhookCall({type: 'credential-state', payload: event.payload.credentialRecord});
                    }
                },
            );

            this.agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, async (event) => {
                console.log(`Connection Record State: ${event.payload.connectionRecord.state}`);
                if(event.payload.connectionRecord.state === "completed"){
                    await webhookCall({type: 'connection-state', payload: event.payload.connectionRecord});
                }
            });

        } catch (e) {
            throw new Error(`Error initializing agent: ${e}`)
        }
    }
    public async getWalletDids(method?: string): Promise<DidRecord[]> {
        return this.agent.dids.getCreatedDids({
            method: method
        })
    }
    public async importDid(did: string, seed: string) {
        if (!did) {
            throw new Error('Did is required')
        }
        if (!seed) {
            throw new Error('Seed is required')
        }
        const seedBfr = TypedArrayEncoder.fromString(seed);
        await this.agent.dids.import({
            did: did,
            privateKeys: [
                {
                    keyType: KeyType.Ed25519,
                    privateKey: seedBfr
                }
            ],
            overwrite: true
        })

    }
    public async createInvitation(options: CreateInvitationOptions) {
        const invitation = await this.agent.oob.createInvitation({
            label: options.label,
            alias: options.alias,
        })
        const invitationUrl = invitation.outOfBandInvitation.toUrl({ domain: options.domain || this.endpoints[0]});
        return { invitationUrl, invitation };
    }
    public async acceptInvitation(options: AcceptInvitationOptions) {
        const record = await this.agent.oob.receiveInvitationFromUrl(options.invitationUrl, {
            label: options.label,
            alias: options.alias,
            imageUrl: options.imageUrl,
        });
        return record;
    }
    public async getConnections(options: GetConnectionsOptions) {
        if (options.connectionId) {
            const record =  await this.agent.connections.findById(options.connectionId)
            return record ? [record] : []
        }
        if (options.outOfBandId) {
            return await this.agent.connections.findAllByOutOfBandId(options.outOfBandId)
        }
        return await this.agent.connections.getAll()
    }
    public async createSchema(did: string, schema: AnonCredsSchema) {

        return await this.agent.modules.anoncreds.registerSchema({
            schema,
            options: {
                endorserMode: 'internal',
                endorserDid: did,
            }
        })
    }
    public async getSchema(schemaId?: string, schema?: AnonCredsSchema, did?: string,  ) {
        if (schemaId) {
            return await this.agent.modules.anoncreds.getCreatedSchemas({
                schemaId
            })
        }

        else if(schema && did){
            return await this.agent.modules.anoncreds.getCreatedSchemas({
                schemaName: schema.name,
                schemaVersion: schema.version,
                issuerId: did
            })
        }
        return await this.agent.modules.anoncreds.getCreatedSchemas({})
    }
    public async createCredentialDefinition(did: string, schemaId: string, tag?: string) {
        return await this.agent.modules.anoncreds.registerCredentialDefinition({
            credentialDefinition: {
                schemaId,
                issuerId: did,
                tag: tag || 'latest',
            },
            options: {
                endorserMode: 'internal',
                endorserDid: did,
                supportRevocation: false,
            },
        })
    }
    public async getCredentialDefinition(credentialDefinitionId?: string, credentialDefinition?: {schemaId: string, issuerId: string, tag: string}) {
        if (credentialDefinitionId) {
            return await this.agent.modules.anoncreds.getCreatedCredentialDefinitions({
                credentialDefinitionId
            })
        }

        else if(credentialDefinition){
            return await this.agent.modules.anoncreds.getCreatedCredentialDefinitions({
                schemaId: credentialDefinition.schemaId,
                issuerId: credentialDefinition.issuerId,
                tag: credentialDefinition.tag
            })
        }
        return await this.agent.modules.anoncreds.getCreatedCredentialDefinitions({})
    }

    public async issueAnonCredsCredential(connectionId: string, credentialDefinitionId: string, attributes: AttributeElement[]) {
        return await this.agent.credentials.offerCredential({
            connectionId,
            protocolVersion: 'v2',
            credentialFormats: {
                anoncreds: {
                    credentialDefinitionId,
                    attributes,
                }
            }
        })
    }
    public async getIssuedCredenitalRecords(credentialExchangeRecordId?: string) {
        if (credentialExchangeRecordId) {
            return await this.agent.credentials.findAllByQuery({
                credentialIds: [credentialExchangeRecordId]
            })
        }
        return await this.agent.credentials.findAllByQuery({})
    }
    public async sendProofRequest({ proofRequestlabel, connectionId, version, attributes, predicates }: SendProofRequest) {
        return await this.agent.proofs.requestProof({
            connectionId,
            protocolVersion: 'v2',
            proofFormats: {
                anoncreds: {
                    name: proofRequestlabel,
                    version: version || '1.0.0',
                    requested_attributes: attributes,
                    requested_predicates: predicates,
                }
            }
        })
    }

    public async sendConnLessProofRequest({ proofRequestlabel, version, attributes, predicates }: SendConnLessProofRequest) {
        const {message, proofRecord} = await this.agent.proofs.createRequest({
            protocolVersion: 'v2',
            proofFormats: {
                anoncreds: {
                    // nonce: Date.now().toString(),
                    name: proofRequestlabel,
                    version: version || '1.0.0',
                    requested_attributes: attributes,
                    requested_predicates: predicates,
                }
            }
        });

        const outOfBandRecord = await this.agent.oob.createInvitation({
            handshake: false,
            messages: [message]
        });

        const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({
            domain: this.endpoints[0]
        })

        console.log('------>>>> invitation url: ', invitationUrl);

        return invitationUrl;
    }

    public async getProofRecords(proofRecordId?: string) {
        if (proofRecordId) {
            return await this.agent.proofs.findAllByQuery({
                proofIds: [proofRecordId]
            })
        }
        return await this.agent.proofs.findAllByQuery({})
    }
    public async getProofData(proofRecordId: string) {
        return await this.agent.proofs.getFormatData(proofRecordId)
    }
    public async getProofRecord(proofRecordId: string) {
        return await this.agent.proofs.findById(proofRecordId);
    }
    public async sendMessage(connectionId: string, message: string) {
        return await this.agent.basicMessages.sendMessage(connectionId, message)
    }

    //* -------- Revocation Registry -------- *//
   
    public async createRevocationRegistry(credentialDefinitionId: string, issuerDid: string) {
        
        const registryDefinition = await this.agent.modules.anoncreds.registerRevocationRegistryDefinition({
            revocationRegistryDefinition: {
              issuerId: issuerDid,
              tag: utils.uuid(),
              credentialDefinitionId,
              maximumCredentialNumber: 100,
            },
            options: {}
          })

          console.log('Revocation Registry Definition:', registryDefinition);
      
          return registryDefinition
    }

    public async createRevocationStatusList(revocationRegistryDefinitionId: string, issuerId: string){
        const revocationStatusList = await this.agent.modules.anoncreds.registerRevocationStatusList({
            revocationStatusList: {
              issuerId,
              revocationRegistryDefinitionId,
            },
            options: {}
          })

          console.log('Revocation Status List:', revocationStatusList);
      
          return revocationStatusList
    }

    public async issueRevocableCredential(
        connectionId: string, 
        credentialDefinitionId: string,
        revocationRegistryDefinitionId: string,
        revocationRegistryIndex: number,
        attributes: AttributeElement[]
      ) {
        return await this.agent.credentials.offerCredential({
          connectionId,
          credentialFormats: {
            anoncreds: {
              credentialDefinitionId,
              attributes,
              revocationRegistryDefinitionId,
              revocationRegistryIndex,
            }
          },
          protocolVersion: 'v2'
        })
      }

    public async revokeCredential(
        credentialId: string,
    ) {
    const credentialRecord = await this.agent.credentials.getById(credentialId);

    const credentialRevocationRegistryDefinitionId =
    credentialRecord.getTag("anonCredsRevocationRegistryId") as string;

    const credentialRevocationIndex = credentialRecord.getTag(
      "anonCredsCredentialRevocationId"
    ) as string;

    console.log("REVOKING CREDENTIAL ", credentialRevocationIndex);

    const currentStatus = await this.agent.modules.anoncreds.getRevocationStatusList( credentialRevocationRegistryDefinitionId, Math.floor(Date.now() / 1000));

    console.log("BEFORE CREDENTIAL REVOCATION ATTEMPT ==>>", credentialRevocationIndex, currentStatus.revocationStatusList?.revocationList);

    const currentRevocationList = currentStatus.revocationStatusList?.revocationList || [];
    const issuedIndices = currentRevocationList.map((_, index) => index);

    console.log('ISSUED indicies: ', issuedIndices);
    // let currentRevocationIndex = [];
    // let issuedCredentials = [];

    // for(let i=0; i<currentRevocationList.length; i++){
    //     if(i == Number(credentialRevocationIndex)) continue;
    //     if(currentRevocationList[i]==1){
    //         currentRevocationIndex.push(i);
    //     }else {
    //         issuedCredentials.push(i);
    //     }
    // }

    // console.log('currentRevocationIndex: ', currentRevocationIndex);
    // console.log('issuedCredentials: ', issuedCredentials);

    const statusList =
      await this.agent.modules.anoncreds.updateRevocationStatusList({
        revocationStatusList: {
          revocationRegistryDefinitionId: credentialRevocationRegistryDefinitionId,
          revokedCredentialIndexes: [Number(credentialRevocationIndex)],
        //   issuedCredentialIndexes: issuedIndices,
        },
        options: {
            publish: true
        },
      });

      console.log(JSON.stringify(statusList));

      console.log("AFTER CREDENTIAL REVOCATION ATTEMPT ==>>", credentialRevocationIndex, statusList.revocationStatusListState.state);
      
      await this.agent.credentials.sendRevocationNotification({
        credentialRecordId: credentialRecord.id,
        revocationFormat: "anoncreds",
        revocationId: `${credentialRevocationRegistryDefinitionId}::${credentialRevocationIndex}`,
      });

      return;
    }
      
    

    //*-------------------------- END --------------------------*//

    private generateRandomString(length: number) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            result += charset[randomIndex];
        }
        return result;
    }

    public async createAndPublishDID(method: string, namespace?: string) {
        const didResult = await this.agent.dids.create({
            method: method,
            options: {
              keyType: KeyType.Ed25519,
            }
          });
      
          const state = didResult.didState.state;
          if (state === "failed") {
            throw new Error(didResult.didState.reason);
          }
          console.log((`DID created: ${didResult.didState.did}`));
          return didResult;
    }
}
