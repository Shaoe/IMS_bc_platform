'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const assetDataPre = '{\"id\":\"';
const assetDataPost = '\",\"dfi\":1.2,\"pressure\":1.1,\"temperature\":5.5,\"dtl\":6.666,\"analysis_time\":666.666,\"spectral_values\":[{\"y\":0,\"x\":0},{\"y\":1,\"x\":0.360871416856906},{\"y\":2,\"x\":1.1413465521420452},{\"y\":3,\"x\":2.587474312343659},{\"y\":4,\"x\":1.1724569782154322},{\"y\":5,\"x\":1.4854128177814576},{\"y\":6,\"x\":4.515438213309672},{\"y\":7,\"x\":1.4460786333958902},{\"y\":8,\"x\":6.922680104012488},{\"y\":9,\"x\":6.270472491719713}]}';
//const assetData = '{\"id\":\"updated\",\"dfi\":1.2,\"pressure\":1.1,\"temperature\":5.5,\"dtl\":6.666,\"analysis_time\":666.666,\"spectral_values\":[{\"y\":0,\"x\":0},{\"y\":1,\"x\":0.360871416856906},{\"y\":2,\"x\":1.1413465521420452},{\"y\":3,\"x\":2.587474312343659},{\"y\":4,\"x\":1.1724569782154322},{\"y\":5,\"x\":1.4854128177814576},{\"y\":6,\"x\":4.515438213309672},{\"y\":7,\"x\":1.4460786333958902},{\"y\":8,\"x\":6.922680104012488},{\"y\":9,\"x\":6.270472491719713}]}';
        
class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.assetCounter = 0;
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        /*
        for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${assetID}`);
            var assetData = assetDataPre.concat(assetID, assetDataPost);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'CreateMyAsset',
                invokerIdentity: 'Admin',
                contractArguments: [assetID, assetData],
                //contractArguments: [assetID,'blue','20','penguin','500'],
                readOnly: false
            };

            //await this.sutAdapter.sendRequests(request);
        }
        */
    }

    
    async submitTransaction() {
        
        //const randomId = Math.floor(Math.random()*this.roundArguments.assets);
        const randomId = Math.floor(Math.random()*3000)+10;
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ReadMyAsset',
            invokerIdentity: 'Admin',
            contractArguments: [`${randomId}`],
            readOnly: true
        };
        
        
        // generate random stuff part, use one worker
            /* 
        const randomId = Math.floor(Math.random()*this.roundArguments.assets);
        //const assetID = `${this.workerIndex}_${this.roundIndex}_${this.assetCounter}`;
        const assetID = `${this.assetCounter}`;
        this.assetCounter = this.assetCounter + 1;
        //console.log(`Worker ${this.workerIndex}: Creating asset ${assetID}`);
        var assetData = assetDataPre.concat(assetID, assetDataPost);
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'CreateMyAsset',
            invokerIdentity: 'Admin',
            contractArguments: [assetID, assetData],
            //contractArguments: [assetID,'blue','20','penguin','500'],
            readOnly: false
        };
        */
        await this.sutAdapter.sendRequests(myArgs);


    }
    
    async cleanupWorkloadModule() {
        /*
        //for (let i=0; i<this.roundArguments.assets; i++) {
            for (let i=0; i<this.assetCounter; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Deleting asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'DeleteMyAsset',
                invokerIdentity: 'Admin',
                contractArguments: [assetID],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
        */
       
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'DeleteAllAssets',
            invokerIdentity: 'Admin',
            contractArguments: [],
            readOnly: false
        };

        //await this.sutAdapter.sendRequests(request);
        
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
