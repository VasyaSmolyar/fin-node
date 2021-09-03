import express from 'express';
import Web3 from 'web3';

import getTokenAbi from './abi/getTokenAbi';
import { BLOCKCHAIN_URL, API_KEY, PRIVATE_KEY, TOKEN_ADDR } from './config';

const app = express();

const web3 = new Web3(BLOCKCHAIN_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
const tokenAbi = getTokenAbi();
const TokenContract = new web3.eth.Contract(tokenAbi, TOKEN_ADDR);

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

app.listen(9000, () => console.log('Finance node started!'));