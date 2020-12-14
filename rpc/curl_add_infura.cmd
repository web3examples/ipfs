@echo off
echo Uploading To Infura
curl "https://ipfs.infura.io:5001/api/v0/add?pin=true" -X POST -H "Content-Type: multipart/form-data" -F file=@Web3examples.txt --fail --silent --show-error 
rem | c:\bin\jq .Hash
pause
