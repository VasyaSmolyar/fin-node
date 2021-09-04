# fin-node
Node.js module with Truffle for working with smartcontracts throw HTTP API

## Install
- Установить глобально truffle `npm install -g truffle`
- Установить необходимые пакеты `npm install`
- Запустить в другом терминале `truffle development`, либо `truffle testnet`, либо `truffle bsc` для выполнения миграций в локальной сети, 
тестовой сети Binance Smart Chain, основной сети соответственно
- Выполнить там же 'migrate'
- В `/service/config.js` установить в `TOKEN_ADDR` адрес контракта `BEP20Token` после миграции, аналогично в `PAYMENT_ADDR` адрес `PaymentContract`
- В том же файле установить в `BLOCKCHAIN_URL` адрес выбранной сети (есть в `truffle-config.js`)
- В том же файле установить в `PRIVATE_KEY` приватный ключ кошелька владельца задеплоенных смартконтрактов
- В том же файле установить в `API_KEY` желаемый ключ HTTP-аутентификации
- Запустить проект `npm start`
