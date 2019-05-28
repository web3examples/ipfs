console.log("Show how to pin a document via Infura");

// Via commandline: ipfs add hello.txt  --cid-version 1 --cid-base base32 
const ipfsClient = require('ipfs-http-client'); // https://github.com/ipfs/js-ipfs-http-client#api
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }); // infura allow everyone to pin documents

async function test() // to be able to use await
{
    var sDataToHash="Groeten van Gerard";   // document text to hash 
    var bufDataToHash = Buffer.from(sDataToHash+"\n");  // newline because that also happens in text file  
    var hash=await ipfs.add(bufDataToHash,{'cid-version': 1,'cid-base': 'base32'}).catch(console.log); // already pinnned by default, see https://infura.io/docs/ipfs/post/add
    console.log(hash[0]);    
    var sig=await ipfs.pin.add(hash[0].hash).catch(console.log);
    console.log(sig);
    

}

test();

