import Authentication from './artifacts/contracts/Authentication.sol/Authentication.json';
// require("dotenv").config({ path: './.env' });

const Contract = async (web3) => {
    const NEXT_PUBLIC_ADDRESS = '0xf6bF36Ea20DE84467Eb31fBd0aa5901496f0187D'

    return new web3.eth.Contract(
        Authentication.abi,
        NEXT_PUBLIC_ADDRESS,
        web3
    );
}

export default Contract;
