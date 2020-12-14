@echo Uploading Web3examples.txt to local ipfs node
curl "http://localhost:5001/api/v0/add?pin=true" -X POST -H "Content-Type: multipart/form-data" -F file=@Web3examples.txt
rem | jq .Hash
pause
