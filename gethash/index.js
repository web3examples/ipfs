console.log("Show how IPFS hashes are created");

const Unixfs = require('ipfs-unixfs');
const dagPB = require('ipld-dag-pb');
const multihashing = require('multihashing');
const multihash = require('multihashes'); // toB58String
const base32Encode = require('base32-encode');

var sDataToHash="hello worlds";                      console.log("00",sDataToHash);// document text to hash // from example on https://blog.ipfs.io/0-hello-worlds/
var bufDataToHash = Buffer.from(sDataToHash+"\n");  // newline because that also happens in text file
                                                     console.log("01",bufDataToHash);        // <Buffer                   68 65 6c 6c 6f 20 77 6f 72 6c 64 73 0a>
// For Cidv0: use unixFS & DAG
var unixFs = new Unixfs('file', bufDataToHash);      console.log("02",unixFs.data);          // <Buffer                   68 65 6c 6c 6f 20 77 6f 72 6c 64 73 0a>
var ufsDataToHash=unixFs.marshal();                  console.log("03",ufsDataToHash);        // <Buffer       08 02 12 0d 68 65 6c 6c 6f 20 77 6f 72 6c 64 73 0a 18 0d> // serialize 
var dagNode = dagPB.DAGNode.create(ufsDataToHash);   console.log("04",dagNode.toJSON().data);// <Buffer       08 02 12 0d 68 65 6c 6c 6f 20 77 6f 72 6c 64 73 0a 18 0d>
var dagDataToHash=dagPB.util.serialize(dagNode);     console.log("05",dagDataToHash);        // <Buffer 0a 13 08 02 12 0d 68 65 6c 6c 6f 20 77 6f 72 6c 64 73 0a 18 0d>
mHashedData=multihashing(dagDataToHash, 'sha2-256'); console.log("06",mHashedData);          // <Buffer 12 20 9f 66 8b 20 cf d2 4c db f9 e1 98 0f a4 86 7d 08 c6 7d 2c af 84 99 e6 df 81 b9 bf 0b 1c 97 28 7d>
b58HashedData=multihash.toB58String(mHashedData);    console.log("07",b58HashedData);        // QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx

// For Cidv1: use direct data
mHashDataV1 = multihashing(bufDataToHash, 'sha2-256');     console.log("11", mHashDataV1);    // <Buffer       12 20 37 3e d7 8e 7d f1 d9 19 58 c2 60 bf 90 48 6b 01 73 39 8b 61 0b de 29 1b b5 76 44 66 2a 87 af 2a>
bufPrefV1 = Buffer.from('0155', 'hex');                    console.log("12",bufPrefV1);       // <Buffer 01 55> // 01 = cid version 1  // 0x55 = "U" ipld	raw binary
bufExHashDataV1 = Buffer.concat([bufPrefV1,mHashDataV1]);  console.log("13",bufExHashDataV1); // <Buffer 01 55 12 20 37 3e d7 8e 7d f1 d9 19 58 c2 60 bf 90 48 6b 01 73 39 8b 61 0b de 29 1b b5 76 44 66 2a 87 af 2a>
b58HashedDataV1="z"+multihash.toB58String(bufExHashDataV1);console.log("14",b58HashedDataV1); // zb2rhaMwCEJiQ7FbitJJhtQMybzLetLwWJeHSSWzj5vJgguR3 //base58btc	z	base58 bitcoin  https://github.com/multiformats/multibase/blob/master/multibase.csv

// For Cidv1: also b32 version
var b32HashedDataV1="b"+base32Encode( bufExHashDataV1,'RFC4648',{ padding: false }); console.log("31",b32HashedDataV1); // bAFKREIBXH3LY47PR3EMVRQTAX6IEQ2YBOM4YWYIL3YURXNLWIRTCVB5PFI //base32	b	rfc4648 no padding

// Show the results
console.log("Cidv0 "+sDataToHash+" directly calculated (B58)=>"+b58HashedData);                  // QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx
console.log("Cidv1 "+sDataToHash+" directly calculated (B58)=>"+b58HashedDataV1);                // zb2rhaMwCEJiQ7FbitJJhtQMybzLetLwWJeHSSWzj5vJgguR3
console.log("Cidv1 "+sDataToHash+" directly calculated (B32)=>"+b32HashedDataV1.toLowerCase());  // bafkreibxh3ly47pr3emvrqtax6ieq2ybom4ywyil3yurxnlwirtcvb5pfi

// Also via function dagPB.util.cid
dagPB.util.cid(dagDataToHash, {cidVersion: 0}).then( (ss) => {console.log("Cidv0 "+sDataToHash+" via dagPB.util.cid  (B58)=>"+multihash.toB58String(ss.multihash))} ); //QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx
//dagPB.util.cid(dagDataToHash, {cidVersion: 1}).then( (ss) => {q = Buffer.concat( [bufPrefV1,ss.multihash] ); r="z"+multihash.toB58String(q);  console.log("Cidv1 "+sDataToHash+" via dagPB.util.cid  (B58)=>"+r);} ); 
// zb2rhhNWhy8tiumQ3vPLBKU1ivBKYdGpvLwTf2diqvoJoiuUg  // this isn't resolved by the gateway e.g. doesn't exist

// Via commandline: ipfs add hello.txt  --cid-version 1 --cid-base base32 
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }); 
// const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });  // to use local instance of IPFS

ipfs.add(bufDataToHash, {'cid-version': 0,onlyHash: true}).then( (r) =>{console.log("Cidv0 "+sDataToHash+" via ipfs.add          (B58)=>"+r[0].hash);}); //QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx
ipfs.add(bufDataToHash, {'cid-version': 1,onlyHash: true}).then( (r) =>{console.log("Cidv1 "+sDataToHash+" via ipfs.add          (B58)=>"+r[0].hash);});  //zb2rhaMwCEJiQ7FbitJJhtQMybzLetLwWJeHSSWzj5vJgguR3
ipfs.add(bufDataToHash, {'cid-version': 1,'cid-base': 'base32',onlyHash: true}).then( (r) =>{console.log("Cidv1 "+sDataToHash+" via ipfs.add          (B32)=>"+r[0].hash);});  //zb2rhaMwCEJiQ7FbitJJhtQMybzLetLwWJeHSSWzj5vJgguR3


