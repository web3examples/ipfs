console.log("Try to find a CID"); // using js-ipfs

const IPFS = require('ipfs')

const ipfs = new IPFS({
  config: {
    Addresses: {Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']}    
  },
  relay: {enabled: true, hop: {enabled: true}},
  EXPERIMENTAL: {dht: true}
});



ipfs.on('error', error => {  console.error('Something went wrong!', error) });

ipfs.on('stop', () => console.log('Node stopped!'))  
  


ipfs.on('ready', async () => {
  const version = await ipfs.version()
  console.log('Version:', version.version)
  
//  ipfs.config.get((err, config) => {
//  if (err) {
//    throw err
//  }
//  console.log(config)
//})

  
  
//  const filesAdded = await ipfs.add({
//    path: 'hello.txt',
//    content: Buffer.from('Hello World 101')
//  })

//  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
const fileBuffer = await ipfs.cat('QmXgZAUWd8yo4tvjBETqzUy3wLx5YRzuDwUQnBwRGrAmAo')

  console.log('Added file contents:', fileBuffer.toString())
  
  
    const fileBuffer2 = await ipfs.cat('QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx');
      console.log('File contents:', fileBuffer2.toString())
  
//ipfs.dht.findProvs("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", function (err, res) 
//{timeout:"1m"}
// 'num-providers':5,maxNumProviders:5 
// ,{timeout:"100s"}
//    {  
//       if (err) console.log("Error "+err); 
//       else { 
//            console.log  (res);
            //console.log(res[0].id._idB58String) 
//       }
//    });
    



  
  try {
    await ipfs.stop()
    console.log('Node stopped!')
  } catch (error) {
    console.error('Node failed to stop cleanly!', error)
  }
  
})
  