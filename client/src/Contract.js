import Authentication from './artifacts/contracts/Authentication.sol/Authentication.json';
// require("dotenv").config({ path: './.env' });

const Contract = async (web3) => {
    const NEXT_PUBLIC_ADDRESS = '0x4e14B77748c3e880447e879d3485Eb184d32080B'

    return new web3.eth.Contract(
        Authentication.abi,
        NEXT_PUBLIC_ADDRESS,
        web3
    );
}

export default Contract;
