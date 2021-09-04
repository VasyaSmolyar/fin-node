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

## API
Все методы принимают заголовок Authorization: {token}, `token` по умолчанию. В случае успеха возвращают код 200 и `{ result: результат }`

- GET `/send` Params: `address` string, `amount` int. Пополнить кошелёк на сумму в копейках. Возвращает транзакцию. Пример: `/send?address=0x702AB91f8Bb8e4f0faf8B118a6A4558167AAA720&amount=10000`
- GET `/receive` Params: `privateKey` string, `amount` int. Снять с кошелька с данным приватным ключём сумму в копейках.  Возвращает транзакцию. Пример: `receive?privateKey=0x3b3e78dd48429e9d12d6c2cbb913bdda5961e2564623370e25a788cd1c8c657f&amount=10000`
- GET `/wallet/create`. Создать новый кошелёк. Возвращает `{privateKey: string, address: string }`.
