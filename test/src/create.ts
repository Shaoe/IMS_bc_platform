import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'Org1Wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    const connectionProfilePath = path.resolve(__dirname, '..', '1OrgLocalFabricOrg1GatewayConnection.json');
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('test');

    
    // Submit the specified transaction.
    const spectra = "{\"id\":\"typescripttest\",\"dfi\":1.2,\"pressure\":1.1,\"temperature\":5.5,\"dtl\":6.666,\"analysis_time\":666.666,\"spectral_values\":[{\"y\":0,\"x\":0},{\"y\":1,\"x\":0.360871416856906},{\"y\":2,\"x\":1.1413465521420452},{\"y\":3,\"x\":2.587474312343659},{\"y\":4,\"x\":1.1724569782154322},{\"y\":5,\"x\":1.4854128177814576},{\"y\":6,\"x\":4.515438213309672},{\"y\":7,\"x\":1.4460786333958902},{\"y\":8,\"x\":6.922680104012488},{\"y\":9,\"x\":6.270472491719713}]}"
    

    await contract.submitTransaction('CreateMyAsset', '100', spectra);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    gateway.disconnect();

  } catch (error) {
    console.error('Failed to submit transaction:',error);
    process.exit(1);
  }
}
void main();