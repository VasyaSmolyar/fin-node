import express from 'express';
import Web3 from 'web3';

import { getTokenAbi, getPaymentAbi } from './abi';
import { BLOCKCHAIN_URL, API_KEY, PRIVATE_KEY, TOKEN_ADDR, PAYMENT_ADDR } from './config';

const app = express();

const web3 = new Web3(BLOCKCHAIN_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
const tokenAbi = getTokenAbi();
const paymentAbi = getPaymentAbi();
const TokenContract = new web3.eth.Contract(tokenAbi, TOKEN_ADDR);
const PaymentContract = new web3.eth.Contract(paymentAbi, PAYMENT_ADDR);

app.use(function(request, response, next) {
  const token = request.header('Authorization');  
  if (token === API_KEY)
    next();
  else
    response.send({data: 'Access token is invalid.'});
});

app.get("/send", async function(request, response) {
  try {
    const address = request.query.address;
    const amount = request.query.amount;

    const gas = await TokenContract.methods.transfer(address, amount).estimateGas();

    const result = await TokenContract.methods.transfer(address, amount).send({
      from: account.address,
      gas
    });

    response.send({
      result: result
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
});

app.get("/receive", async function(request, response) {
  try {
    const privateKey = request.query.privateKey;
    const amount = request.query.amount;

    const sender = web3.eth.accounts.privateKeyToAccount(privateKey);

    const gas = await TokenContract.methods.transferFrom(sender.address, account.address, amount).estimateGas();

    const result = await TokenContract.methods.transferFrom(sender.address, account.address, amount).send({
      from: account.address,
      gas
    });

    response.send({
      result: result
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
})

app.get("/contract/create", async function(request, response) {
  try {
    const id = request.query.id;
    const startShare = request.query.startShare;
    const endShare = request.query.endShare;
    const startTime = Date.parse(request.query.startTime);
    const endTime = Date.parse(request.query.endTime);
    
    if(isNaN(startTime) || isNaN(endTime)) {
      response.status(400).send({ error: 'Timestamps have wrong format.'});
    }

    const gas = await PaymentContract.methods.create(id, startShare, endShare, startTime, endTime).estimateGas();

    const result = await PaymentContract.methods.create(id, startShare, endShare, startTime, endTime).send({
      from: account.address,
      gas
    });

    response.send({
      result: result
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
});

app.get("/contract/find", async function(request, response) {
  try {
    const id = request.query.id;

    const result = await PaymentContract.methods.find(id).call();
    if(result[0] === "0") {
      response.status(404).send({ error: "Not found" });
      return;
    }

    response.send({
      result: {
        id: result[0],
        startShare: result[1], 
        endShare: result[2], 
        startTime: result[3], 
        endTime: result[4]
      }
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
});

app.get("/contract/check", async function(request, response) {
  try {
    const id = request.query.id;
    const timeStamp = Date.parse(request.query.timeStamp);

    if(isNaN(timeStamp)) {
      response.status(400).send({ error: 'Timestamp have wrong format.'});
      return;
    }

    const deal = await PaymentContract.methods.find(id).call();
    if(deal[0] === "0") {
      response.status(404).send({ error: "Not found" });
    }

    const result = await PaymentContract.methods.getShare(id, timeStamp).call();

    response.send({
      result: result / 100000
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
});

app.get("/wallet/create", async function(request, response) {
  try {
    const account = web3.eth.accounts.create();

    response.send({
      result: account
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
})

app.get("/wallet/balance", async function(request, response) {
  try {
    const address = request.query.address;

    const result = await TokenContract.methods.balanceOf(address).call();

    response.send({
      result: result
    })
  } catch(e) {
    response.status(500).send({ error: e.name + ": " + e.message });
  }
})

app.listen(9000, () => console.log('Finance node started!'));