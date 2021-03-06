//process.env.LOG="debug" // debugging for orbitdb LOG=[debug|warn|error]
//process.env.DEBUG="*"   // debugging for IPFS
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

async function main() {    
    const ipfs = await IPFS.create({ 
        repo: './write-db-ipfs',
        config: {  Addresses: { Swarm: [      
            "/ip4/0.0.0.0/tcp/4022", // different port number
            "/ip4/127.0.0.1/tcp/4023/ws" // to allow interaction with browser  // different port number    
        ] } } 
    })         
    const orbitdb = await OrbitDB.createInstance(ipfs,{ directory: './write-db-orbitdb' })   
    console.log(`orbitdb id=${orbitdb.id}`);    
    var accessController = { write: ["*"] }    // writeable for everyone
    const db = await orbitdb.log('events',{
        accessController:accessController,   
        meta: { name: 'web3examples demonstration' }// results in a different orbit database address
    })    
    await db.load();
    const address = db.address;    
    console.log(`address=${db.address.toString()}`);
    var h1=await db.add({ time: new Date().getTime() })
    const result = db.iterator({ limit: -1 }).collect().map(e => e.payload.value)
    console.log(`#records: ${result.length}`);
           
    db.events.on('replicated', () => {  // When the second database replicated new heads, query the database
        const result = db.iterator({ limit: -1 }).collect().map(e => e.payload.value)
        console.log(`#records: ${result.length}`);
    })
    
    setInterval(async () => { // add a record every 10 seconds
        var h1=await db.add({ time: new Date().getTime() })        
        const result = db.iterator({ limit: -1 }).collect().map(e => e.payload.value)
        console.log(`#records: ${result.length}`);
        }, 10000)
}
main();
