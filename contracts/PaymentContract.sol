// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

contract PaymentContract {

  struct Deal {
    uint id;
    uint startShare;
    uint endShare;
    uint startTime;
    uint endTime;
  }

  Deal[] public deals;

  function create (
    uint id,
    uint startShare,
    uint endShare,
    uint startTime,
    uint endTime
  ) public returns (bool) {
    for (uint i = 0; i < deals.length; i++) {
      if(deals[i].id == id) {
        return false;
      }
    }
    deals.push(Deal({
      id: id,
      startShare: startShare,
      endShare: endShare,
      startTime: startTime,
      endTime: endTime
    }));
    return true;
  }

  function find (
    uint id
  ) public view returns (Deal memory) {
    for (uint i = 0; i < deals.length; i++) {
      if(deals[i].id == id) {
        return deals[i];
      }
    }
  }

  function getShare (
    uint id,
    uint timeStamp
  ) public view returns (uint) {
    for (uint i = 0; i < deals.length; i++) {
      if(deals[i].id == id) {
        // Автоматически переводим в проценты с ошибкой округления в 0.01%
        uint totalShare = (deals[i].endTime - timeStamp) / ((deals[i].endTime - deals[i].startTime) / 10000);
        return totalShare * 100;
      }
    }
  }
}
