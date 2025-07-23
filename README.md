# SSI Authentication System

## Project Overview

The **SSI Authentication System** is a comprehensive full-stack implementation that demonstrates the power of Self-Sovereign Identity (SSI) for secure authentication. This project integrates three core components: a Next.js frontend interface, an Express.js backend server, and a specialized SSI agent built on Credo framework.

This system serves as a practical example of how SSI technology can revolutionize digital identity management by putting users in complete control of their credentials while maintaining the highest standards of security and privacy.

## The SSI advantage beyond the traditional authentication

### Current Authentication Limitations

Traditional authentication systems rely heavily on centralized identity providers such as Google, Facebook, Microsoft, or enterprise SSO solutions. While convenient, these systems present significant challenges:

**Security Vulnerabilities:**
- Single points of failure make entire user bases vulnerable to large-scale breaches
- Centralized databases become attractive targets for cybercriminals
- Password-based systems are susceptible to credential stuffing and brute force attacks
- Users have limited visibility into how their data is stored and protected

**Privacy Concerns:**
- Identity providers collect extensive personal data for profiling and advertising
- Users cannot control what information is shared with third-party applications
- Cross-platform tracking enables comprehensive surveillance of user behavior
- Data retention policies often favor the provider over user privacy rights


### Self-Sovereign Identity Solutions

SSI fundamentally transforms the authentication landscape by decentralizing identity management and empowering users with unprecedented control over their digital identities.

**Enhanced Security Architecture:**
- Cryptographic proofs eliminate the need for shared secrets or passwords
- Distributed architecture removes single points of failure
- Zero-knowledge proofs allow verification without exposing sensitive data
- Tamper-evident credentials ensure integrity throughout their lifecycle

**Trust and Verification:**
- Credentials are issued by trusted authorities but owned by users
- Verifiable credentials can be instantly authenticated without contacting issuers
- Decentralized identifiers (DIDs) provide persistent, globally unique identities
- Trust networks enable flexible verification policies

## Project Architecture

```
ssi-auth-system/
├── interface/          # Frontend application (Next.js)
├── server/            # Backend API server (Express.js)
└── ssi-agent/         # SSI agent services (Hyperledger Aries/Credo)
```

## System Requirements

- **Node.js**: Version 18.0 or higher (LTS recommended)
- **Yarn**: Version 3.0 or higher for package management
- **MongoDB**: Database server for backend data storage
- **Git**: For version control and repository cloning

## Installation Guide

### Step 1: Repository Setup

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-organization/ssi-auth-system.git
cd ssi-auth-system
```

### Step 2: Environment Configuration

Before installing dependencies, configure the environment variables for each component:

#### Frontend Interface Configuration
```bash
cd interface
cp .env.sample .env
# Edit .env file with your specific configuration
```

#### Backend Server Configuration
```bash
cd ../server
cp .env.sample .env
# Edit .env file with database credentials and API endpoints
```

#### SSI Agent Configuration
```bash
cd ../ssi-agent
cp .env.sample .env
# Edit .env file with agent endpoints and wallet configuration
```

### Step 3: Dependency Installation

Install the required packages for each component:

#### Install Frontend Dependencies
```bash
cd interface
yarn install
```

#### Install Backend Dependencies
```bash
cd ../server
yarn install
```

#### Install SSI Agent Dependencies
```bash
cd ../ssi-agent
yarn install
```

## Running the System

### Prerequisites Check

Ensure MongoDB is running and accessible. You can start MongoDB using:

**Local Installation:**
```bash
mongod --dbpath /path/to/your/db
```
Or, in linux system:
```bash
sudo systemctl start mongod
```

Check mongodb status:
```bash
sudo systemctl status mongod
```

### Component Startup Sequence

Follow this sequence to start all system components:

#### 1. Start the SSI Agent
```bash
cd ssi-agent
yarn start
```
The SSI agent will initialize and be available for credential operations.

#### 2. Launch the Backend Server
```bash
cd ../server
yarn start
```
The Express server will connect to MongoDB and the SSI agent.

#### 3. Run the Frontend Interface
```bash
cd ../interface
yarn dev
```
The Next.js development server will start and be accessible at `http://localhost:3000`.

## Environment Configuration Details 
// todo

## Using the System

// todo