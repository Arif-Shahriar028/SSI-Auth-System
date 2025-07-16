import WebSocket from 'ws'

// singletone class
class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocket.Server | null = null;
  private clients: Map<string, WebSocket> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(server: any): void {
    this.wss = new WebSocket.Server({ server });
    
    this.wss.on('connection', (ws: WebSocket, req: any) => {
      const email = new URL(req.url!, `ws://${req.headers.host}`).searchParams.get('email');
      
      if (!email) {
        console.error('Connection attempt without email');
        ws.close();
        return;
      }

      // Store client connection
      this.clients.set(email, ws);
      console.log(`Client connected with email: ${email}`);

      ws.on('close', () => {
        this.clients.delete(email);
        console.log(`Client disconnected: ${email}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for ${email}: ${error}`);
        this.clients.delete(email);
      });
    });
  }

  public notifyConnectionUpdate(email: string, data: any): void {
    const client = this.clients.get(email);
    if (client?.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type: 'CONNECTION_UPDATE',
          data
        }));
        console.log(`Notification sent to ${email}`);
      } catch (error) {
        console.error(`Error sending notification to ${email}: ${error}`);
      }
    }
  }

  public notifyCredentialUpdate(email: string, data: any): void {
    const client = this.clients.get(email);
    if (client?.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type: 'CREDENTIAL_UPDATE',
          data
        }));
        console.log(`Notification sent to ${email}`);
      } catch (error) {
        console.error(`Error sending notification to ${email}: ${error}`);
      }
    }
  }

  public notifyProofRequestUpdate(email: string, data: any): void {
    const client = this.clients.get(email);
    if (client?.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type: 'PROOF_UPDATE',
          data
        }));
        console.log(`Notification sent to ${email}`);
      } catch (error) {
        console.error(`Error sending notification to ${email}: ${error}`);
      }
    }
  }

  public notifyMultipleClients(emails: string[], data: any): void {
    emails.forEach(email => this.notifyCredentialUpdate(email, data));
  }

  public getConnectedClients(): string[] {
    return Array.from(this.clients.keys());
  }
}

export default WebSocketService;