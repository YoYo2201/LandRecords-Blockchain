Instructions to run the program:
1. Clone the repository and run "npm i" in that folder.
2. Go to client folder and again run "npm i".
3. Make sure you have metamask enabled in your web browser.
4. Go to /client/src/server/ and run ipfs.js file using the command "node ipfs.js"  -> Backend server is just there to send OTP to the email address of the user who wants to sell his/her land.
5. Go to the parent directory and run the command "npx hardhat run client/src/components/deploy.js" to deploy the solidity files.
6. Go to client folder and run "npm start" to start the react website.
