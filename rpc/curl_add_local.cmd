@echo Uploading Web3examples.txt to local ipfs node
curl -X POST "http://127.0.0.1:5001/api/v0/add?pin=true" -H "Content-Type: multipart/form-data" -F file=@Web3examples.txt
rem | jq .Hash
pause
