#IPFS



npm install --global windows-build-tools 
npm install -g browserify
npm install -g ipfs-http-client
npm link ipfs-http-client


npm install -g ieee754
npm install -g base64-js

browserify ipfs-require.js -o ipfs-browserify.js 

npm install -g buffer
npm link buffer

browserify budo-test.js -o bundle.js


    