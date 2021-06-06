import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main() {

submitTransaction();

}
void main();

async function submitTransaction() {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'org0.example.com');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    const connectionProfilePath = path.resolve(__dirname, '..', 'Test2GwConnection.json');
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions = { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } };
    console.log(`Awaiting connection`);
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    console.log(`Getting channel`);    
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    console.log(`Getting contract`);
    const contract = network.getContract('sc');

    // Submit the specified transaction.
    console.log(`Submitting transaction`);
    const results = await contract.evaluateTransaction('QuerryAllAssets');
    console.log(`Transaction has been evaluated, result is: ${results.toString()}`);;

    // Disconnect from the gateway.
    gateway.disconnect();

  } catch (error) {
    console.error('Failed to submit transaction:',error);
    process.exit(1);
  }
  
}
