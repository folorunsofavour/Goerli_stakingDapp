const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const API_URL = "https://eth-goerli.g.alchemy.com/v2/CH1V81ZMzVXNjIFWnRNNTTgY0nD_Twh6";
const web3 = createAlchemyWeb3(API_URL);

//collection config
const collectionABI = require("./abi/collectionABI.json");
const c_addressCollection = "0x924D4Ed3090B44600b5577F19Bb02C53D5C5A9e1";
const contractCollection = new web3.eth.Contract(collectionABI, c_addressCollection);


//reward config
const tokenABI = require("./abi/tokenABI.json");
const c_addressToken = "0xB5160972eeD85c7795c27f66b00118b051033425";
const contractToken = new web3.eth.Contract(tokenABI, c_addressToken);


//staking config
const stakingABI = require("./abi/stakingABI.json");
const c_addressStaking = "0x5BF9E606B55E548054Dd10456B57E267c7Cf3163";
const contractStaking = new web3.eth.Contract(stakingABI, c_addressStaking);




export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const obj = {
        status: "",
        address: addressArray[0],
      };

      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "You must install MetaMask, a virtual Ethereum wallet, in your browser."
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "",
        };
      } else {
        return {
          address: "",
          status: "",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "You must install MetaMask, a virtual Ethereum wallet, in your browser."
    };
  }
};

let response = {
  success: false,
  status: ""
};


// Contract Methods

export const getTotalSupply = async () => {
  const result = await contractCollection.methods.totalSupply().call();
  return result;
};

export const checkApproval = async (account) => {
  const result = await contractCollection.methods.isApprovedForAll(account, c_addressStaking).call();
  return result;
};

export const setApproval = async (account) => {

  await contractCollection.methods.setApprovalForAll(c_addressStaking, true)
  .send({
    from: account,
    to: c_addressCollection
  })
  .then(function(receipt){
    console.log("receipt: ", receipt);
    response.success = true;
    response.status = "Approved successfully"
  }).catch(function(error){
    console.log("error: ", error);
    response.success = false;
    response.status = "Something went wrong";
  });

  return response;

}

//staking system interaction

export const getNoStakedNFT = async () => {
  const result = await contractStaking.methods.balanceOf(window.ethereum.selectedAddress).call();
  return result;
};


export const getTokenStacked = async () => {
  const result = await contractStaking.methods.tokensOfOwner(window.ethereum.selectedAddress).call();
  return result;
};

export const getClaimableStatus = async () => {
  const result = await contractStaking.methods.tokensClaimable().call();
  return result;
};

export const getEarningOnStacked = async (tokenids) => {
  const result = await contractStaking.methods.earningInfo(tokenids).call();
  const resultEther = web3.utils.fromWei(result, "ether");
  return resultEther;
};


//reward token interaction

export const getTokenBalance = async () => {
  const result = await contractToken.methods.balanceOf(window.ethereum.selectedAddress).call();
  const resultEther = web3.utils.fromWei(result, "ether");
  return resultEther;
};

export const stakeNFT = async (account, tokens) => {

  await contractStaking.methods.stake(tokens)
  .send({
    from: account,
    to: c_addressStaking
  })
  .then(function(receipt){
    console.log("receipt: ", receipt);
    response.success = true;
    response.status = "Staked successfully";
  }).catch(function(error){
    console.log("error: ", error);
    response.success = false;
    response.status = "Something went wrong";
  });

  return response;

};

export const unStakeNFT = async (account, tokens) => {

  await contractStaking.methods.unstake(tokens)
  .send({
    from: account,
    to: c_addressStaking
  })
  .then(function(receipt){
    console.log("receipt: ", receipt);
    response.success = true;
    response.status = "Unstacked successfully";
  }).catch(function(error){
    console.log("error: ", error);
    response.success = false;
    response.status = "Something went wrong";
  });

  return response;
};

export const claimReward = async (account, tokens) => {

  await contractStaking.methods.claim(tokens)
  .send({
    from: account,
    to: c_addressStaking
  })
  .then(function(receipt){
    console.log("receipt: ", receipt);
    response.success = true;
    response.status = "Rewards claimed";
  }).catch(function(error){
    console.log("error: ", error);
    response.success = false;
    response.status = "Something went wrong";
  });

  return response;
};



