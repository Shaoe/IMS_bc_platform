"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fabric_network_1 = require("fabric-network");
var path = require("path");
var fs = require("fs");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var id, dfi, pressure, temp, dtl, at, spec, first_run, re, myArgs, filename, readline, readInterface;
        return __generator(this, function (_a) {
            spec = [];
            first_run = true;
            re = /^\s\d*.*\d*$/m;
            myArgs = process.argv.slice(2);
            if (myArgs[0] == undefined) {
                filename = 'Spectra.POSITIVE.txt';
            }
            else {
                filename = myArgs[0];
            }
            readline = require('readline');
            readInterface = readline.createInterface(fs.createReadStream(filename, 'utf8'));
            // Loops throug each line, reads one line at time
            readInterface.on('line', function (line) {
                if (line.startsWith('Spectrum')) {
                    if (first_run == false) {
                        // Parse the spectrum header into json
                        var spectrum = "{\"id\":\"";
                        var currentDate = new Date();
                        var currentDate2 = '123';
                        spectrum = spectrum.concat(id, "\",\"added\":\"", currentDate2.toString(), "\",\"updated\":\"", currentDate2.toString());
                        spectrum = spectrum.concat("\",\"dfi\":", dfi, ",\"pressure\":", pressure, ",\"temperature\":");
                        spectrum = spectrum.concat(temp, ",\"dtl\":", dtl, ",\"analysis_time\":", at, ",\"spectral_values\":[");
                        spec.forEach(function (x, i) {
                            return spectrum = spectrum.concat("{\"y\":", x[0], ",\"x\":", x[1], "},");
                        });
                        spectrum = spectrum.slice(0, -1);
                        spectrum = spectrum.concat("]}");
                        //console.log(spectra);
                        // Call smartcontract
                        submitTransaction(id, spectrum);
                        // Clear variables
                        spec = [];
                    }
                    else {
                        first_run = false;
                    }
                    id = line;
                    //console.log(id);
                    return;
                }
                if (line.startsWith('Drift field intensity:')) {
                    dfi = line.match(/ \d+\.?\d*/)[0];
                    dfi = dfi.replace(/\s+/, '');
                    //console.log(dfi);
                    return;
                }
                if (line.startsWith('Pressure:')) {
                    pressure = line.match(/ \d+\.?\d*/)[0];
                    pressure = pressure.replace(/\s+/, '');
                    //console.log(pressure);
                    return;
                }
                if (line.startsWith('Temperature')) {
                    temp = line.match(/ \d+\.?\d*/)[0];
                    temp = temp.replace(/\s+/, '');
                    //console.log(temp);
                    return;
                }
                if (line.startsWith('Drift tube length:')) {
                    dtl = line.match(/ \d+\.?\d*/)[0];
                    dtl = dtl.replace(/\s+/, '');
                    //console.log(dtl);
                    return;
                }
                if (line.startsWith('Analysis time:')) {
                    at = line.match(/ \d+\.?\d*/)[0];
                    at = at.replace(/\s+/, '');
                    //console.log(at);
                    return;
                }
                if (re.test(line)) {
                    var match = line.match(/ -?\d+\.?\d*/g);
                    var x = match[0];
                    var y = match[1];
                    spec.push([x, y]);
                    //console.log('this is spec: ',spec);
                }
                else {
                    //console.log(line,'nope');
                }
            })
                .on('close', function (line) {
                return __awaiter(this, void 0, void 0, function () {
                    var spectrum, currentDate, currentDate2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                spectrum = "{\"id\":\"";
                                currentDate = new Date();
                                currentDate2 = '123';
                                spectrum = spectrum.concat(id, "\",\"added\":\"", currentDate2.toString(), "\",\"updated\":\"", currentDate2.toString());
                                spectrum = spectrum.concat("\",\"dfi\":", dfi, ",\"pressure\":", pressure, ",\"temperature\":");
                                spectrum = spectrum.concat(temp, ",\"dtl\":", dtl, ",\"analysis_time\":", at, ",\"spectral_values\":[");
                                //spec.forEach((x,i) => console.log(i,"th element: ",x));
                                spec.forEach(function (x, i) {
                                    return spectrum = spectrum.concat("{\"y\":", x[0], ",\"x\":", x[1], "},");
                                });
                                spectrum = spectrum.slice(0, -1);
                                spectrum = spectrum.concat("]}");
                                //console.log(spectra);
                                //call smartcontract
                                return [4 /*yield*/, submitTransaction(id, spectrum)];
                            case 1:
                                //console.log(spectra);
                                //call smartcontract
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
void main();
function submitTransaction(id, spectra) {
    return __awaiter(this, void 0, void 0, function () {
        var walletPath, wallet, gateway, connectionProfilePath, connectionProfile, connectionOptions, network, contract, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    walletPath = path.join(process.cwd(), 'wallet');
                    return [4 /*yield*/, fabric_network_1.Wallets.newFileSystemWallet(walletPath)];
                case 1:
                    wallet = _a.sent();
                    console.log("Wallet path: " + walletPath);
                    gateway = new fabric_network_1.Gateway();
                    connectionProfilePath = path.resolve(__dirname, '..', 'Connection.json');
                    connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
                    connectionOptions = { wallet: wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } };
                    return [4 /*yield*/, gateway.connect(connectionProfile, connectionOptions)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, gateway.getNetwork('mychannel')];
                case 3:
                    network = _a.sent();
                    contract = network.getContract('sc');
                    // Submit create new asset transaction
                    return [4 /*yield*/, contract.submitTransaction('CreateMyAsset', id, spectra)];
                case 4:
                    // Submit create new asset transaction
                    _a.sent();
                    console.log('Transaction has been submitted');
                    // Disconnect from the gateway.
                    gateway.disconnect();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Failed to submit transaction:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
