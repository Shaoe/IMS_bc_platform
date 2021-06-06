import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
var id: string, dfi: string, pressure: string, temp: string, dtl: string, at: string;
var spec: any[][] = [];
var first_run = true;
let re = /^\s\d*.*\d*$/m;

var myArgs = process.argv.slice(2);
var filename;
if (myArgs[0]==undefined){
   filename = 'Spectra.POSITIVE.txt';
}else{
   filename = myArgs[0];
}



const readline = require('readline');
const readInterface = readline.createInterface(fs.createReadStream(filename,'utf8'));

// Loops throug each line, reads one line at time
readInterface.on('line', function(line: any) {

  if(line.startsWith('Spectrum')){
      if(first_run == false){

          // Parse the spectrum header into json
          var spectrum = "{\"id\":\"";
          const currentDate = new Date();
          var currentDate2 = '123';
          spectrum = spectrum.concat(id,"\",\"added\":\"",currentDate2.toString(),"\",\"updated\":\"",currentDate2.toString());
          spectrum = spectrum.concat("\",\"dfi\":",dfi,",\"pressure\":",pressure,",\"temperature\":");
          spectrum = spectrum.concat(temp,",\"dtl\":",dtl,",\"analysis_time\":",at,",\"spectral_values\":[");
          spec.forEach((x,i) => 
            spectrum = spectrum.concat("{\"y\":",x[0],",\"x\":",x[1],"},"));
          spectrum = spectrum.slice(0, -1);
          spectrum = spectrum.concat("]}");
          //console.log(spectra);

          // Call smartcontract
          submitTransaction(id,spectrum);

          // Clear variables
          spec = [];
          
      }else{
          first_run = false;
      }
    id = line;
    //console.log(id);
    return;
  }
  if(line.startsWith('Drift field intensity:')){
    dfi = line.match(/ \d+\.?\d*/)[0];
    dfi = dfi.replace(/\s+/,'');
    //console.log(dfi);
    return;
  }
  if(line.startsWith('Pressure:')){
    pressure = line.match(/ \d+\.?\d*/)[0];
    pressure = pressure.replace(/\s+/,'');
    //console.log(pressure);
    return;
  }
  if(line.startsWith('Temperature')){
    temp = line.match(/ \d+\.?\d*/)[0];
    temp = temp.replace(/\s+/,'');
    //console.log(temp);
    return;
  }
  if(line.startsWith('Drift tube length:')){
    dtl = line.match(/ \d+\.?\d*/)[0];
    dtl = dtl.replace(/\s+/,'');
    //console.log(dtl);
    return;
  }
  if(line.startsWith('Analysis time:')){
    at = line.match(/ \d+\.?\d*/)[0];
    at = at.replace(/\s+/,'');
    //console.log(at);
    return;
  }
  if(re.test(line)){
      var match = line.match(/ -?\d+\.?\d*/g);
      var x = match[0];
      var y = match[1];
      spec.push([x,y]);
      //console.log('this is spec: ',spec);
  }else{
      //console.log(line,'nope');
  }


  
})
.on('close',async function(line: any){
    //parse the spectrum header into json
    var spectrum = "{\"id\":\"";
    const currentDate = new Date();
    var currentDate2 = '123';
    spectrum = spectrum.concat(id,"\",\"added\":\"",currentDate2.toString(),"\",\"updated\":\"",currentDate2.toString());
    spectrum = spectrum.concat("\",\"dfi\":",dfi,",\"pressure\":",pressure,",\"temperature\":");
    spectrum = spectrum.concat(temp,",\"dtl\":",dtl,",\"analysis_time\":",at,",\"spectral_values\":[");
    //spec.forEach((x,i) => console.log(i,"th element: ",x));
    spec.forEach((x,i) => 
      spectrum = spectrum.concat("{\"y\":",x[0],",\"x\":",x[1],"},"));

    spectrum = spectrum.slice(0, -1);
    spectrum = spectrum.concat("]}");
    //console.log(spectra);

    //call smartcontract
    await submitTransaction(id,spectrum);
});

  //submitTransaction();

}
void main();

async function submitTransaction(id: string, spectra: string) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
    
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        const connectionProfilePath = path.resolve(__dirname, '..', 'Connection.json');
        const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        const connectionOptions = { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } };
        await gateway.connect(connectionProfile, connectionOptions);
    
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
    
        // Get the contract from the network.
        const contract = network.getContract('sc');
    
        // Submit create new asset transaction
        await contract.submitTransaction('CreateMyAsset', id, spectra);
        console.log('Transaction has been submitted');
    
        // Disconnect from the gateway.
        gateway.disconnect();
    
      } catch (error) {
        console.error('Failed to submit transaction:',error);
        process.exit(1);
      }
  
}
