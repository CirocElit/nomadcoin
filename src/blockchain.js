const CryptoJS = require("crypto-js");

class Block {
    /* 
        새로운 블록을 생성 할 때 마다 호출하는 함수
        블록이 최초로 생성 될 때마다 주는 정보들, 그리고 이 정보들이 블록 안에 저장된다. 
        hash : 인풋을 복잡한 수학적 함수로 뱉어낸 랜덤 아웃풋
        hash = index + previousHash + timestamp + date
        인풋을 받아서 랜덤 아웃풋을 뱉어낸다.
        새로운 블록을 만들면 previousHash에 이전의 hash가 들어가게 된다.
    */
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

/* 첫 블록 */
const genesisBlock = new Block (
    0,
    "2C4CEB90344F20CC4C77D626247AED3ED530C1AEE3E6E85AD494498B17414CAC",
    null,
    1520312194926,
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();

const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock = new Block (
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    addBlockToChain(newBlock);
    return newBlock;
};

const getBlocksHash = block => 
    createHash(block.index, block.previousHash, block.timestamp, block.data);

/* Block의 hash와 index가 유효한지 검사 */
const isNewBlockValid = (candidateBlock, latestBlock) => {
    if (!isNewStructureValid(candidateBlock)) {
        console.log("The candidate block structure is not valid");
        return false;
    } else if (latestBlock.index + 1 != candidateBlock.index) {
        console.log('The candidate block doesnt have a valid index')
        return false;
    } else if (latestBlock.hash != candidateBlock.previousHash) {
        console.log("The previousHash of the candidate block is not the hash of the latest block");
        return false;
    } else if (getBlocksHash(candidateBlock) != candidateBlock.hash) {
        console.log("The hash of this block is invalid");
        return false;
    }
    return true;
}

/* Block 구조 검사 */
const isNewStructureValid = block => {
    return (
        typeof block.index === "number" &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
        typeof block.timestamp === "number" &&
        typeof block.data === "string"
    );
};

const isChainValid = candidateChain => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isGenesisValid(candidateChain[0])) {
        console.log (
            "The candidateChains's genesisBlock is not same as out genesisBlock"
        );
        return false;
    }
    for (let i = 1; i < candidateChain.length; i++) {
        if (!isNewBlockValid(candidateChain[i], candidateChain[i - 1])) {
            return false;
        }
    }
    return true;
};

const replaceChain = candidateChain => {
    if (isChainValid(candidateChain) && newChain.length > getBlockchain().length) {
        blockchain = candidateChain;
        return true;
    } else {
        return false;
    }
};

const addBlockToChain = candidateBlock => {
    if (isNewBlockValid(candidateBlock, getLastBlock())) {
        getBlockchain().push(candidateBlock);    // 배열의 끝에 아이템을 추가한다.
        return true;
    } else {
        return false;
    }
};

module.exports = {
    getBlockchain,
    createNewBlock
};
