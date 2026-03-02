// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ConsentLog {
    
    struct LogEntry {
        string userId;
        string action;
        string detailsHash;
        uint256 timestamp;
    }

    LogEntry[] public logs;

    event LogAdded(string indexed userId, string action, uint256 timestamp);

    function addLog(string memory _userId, string memory _action, string memory _detailsHash) public {
        logs.push(LogEntry({
            userId: _userId,
            action: _action,
            detailsHash: _detailsHash,
            timestamp: block.timestamp
        }));
        emit LogAdded(_userId, _action, block.timestamp);
    }

    function getLogsCount() public view returns (uint256) {
        return logs.length;
    }
}
