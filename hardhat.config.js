require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
// require("dotenv").config({ path: './.env' });

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
})

const privateKey = "893864dba4ac21d7cd9897a6ab4db37bca72ddba7bdc58026499537ae467a3a1"
console.log("private key: "+ privateKey)

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "polygon",
  networks: {
    hardhat: {},
    polygon: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: "XC18M4KYBNPKJBD3X1JSKHDZGQN98VUQBX"
  },
};
