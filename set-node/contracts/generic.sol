pragma solidity ^0.4.11;

/*CONTRACT_TYPE = 0;*/

contract GenericIndicator{
    address public owner;
    mapping(address => bool) private permissions;
    string state;
    event StateChange(address _from, bytes1 _cType, string _state);
    modifier onlyOwner{require(msg.sender == owner);_;}
    modifier onlyAllowed{require(permissions[msg.sender]);_;}
    
    function GenericIndicator() public {owner = msg.sender; permissions[owner] = true;}
    
    function get() public view returns (string){
        return state;
    }
    
    function set(string _state) public onlyAllowed{
            StateChange(msg.sender, 0, _state);
            state = _state;
    }
    function disconnectDevice() public onlyOwner{
        selfdestruct(owner);
    }
    function userPermission(address a, bool val) public onlyOwner{
        permissions[a] = val;
    }
    function getPermissions(address a) public view onlyOwner returns (bool){
        return permissions[a];
    }
}
