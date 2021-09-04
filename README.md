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
- GET `contract/create`. Params: `id` int, `startTime` DateTime, `endTime` DateTime, `startShare` int, `endShare` int. Создать новый контракт. Id - номер договора, должен быть уникальным, startShare и endShare - проценты от 0 до 100, умноженные на сто. Возвращает структуру контракта `{id int, startTime int, endTime int, startShare int, endShare int}`. Пример: `/contract/create?id=1&startTime=2021-09-03T13:51:50.417-07:00&endTime=2022-03-03T13:51:50.417-07:00&startShare=70000&endShare=20000`
- GET `/contract/find`. Params: `id` int. Найти контракт по номеру договора. Возвращает структуру контракта `{id int, startTime int, endTime int, startShare int, endShare int}`. Пример: `/contract/find?id=1`
- GET `/contract/check` Params: `id` int, `startTime` DateTime. Получить по текущему времени процент средств, доступных к выводу арендатором в процентах с точносью до сотых. Возвращает `float` по тпу 49,86. Пример: `/contract/check?id=1&timeStamp=2021-12-03T13:51:50.417-07:00` 
