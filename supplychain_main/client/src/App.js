import { Component } from 'react';
import ItemManagerContracts from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from './getWeb3';

import "./App.css";

class App extends Component {
  state = {loaded:false, cost:0, itemName:"my_supplychain_1"};

  componentDidMount = async () => {
    try {
      // Lấy đối tượng Web3
      this.web3 = await getWeb3();
  
      // Lấy tài khoản của người dùng
      this.accounts = await this.web3.eth.getAccounts();
  
      // Lấy ID của mạng
      this.networkId = await this.web3.eth.net.getId();
  
      // Tạo đối tượng hợp đồng ItemManager
      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContracts.abi,
        ItemManagerContracts.networks[this.networkId] && ItemManagerContracts.networks[this.networkId].address,
      );
  
      // Tạo đối tượng hợp đồng Item
      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );
  
      // Cập nhật trạng thái cho biết Web3 đã được tải
      // this.listenToPaymentEvent();
      this.setState({ loaded: true });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  

handleInputChange = (event) => {
  const target = event.target;
  const value = target.type === "checkbox"? target.checked : target.value;
  const name = target.name;
  this.setState({
    [name]: value
  });
}

handleSubmit = async () => {
  const { cost, itemName } = this.state;
  const itemManagerAddress = '0x0C4f1188d1aDA36580259646b5A3f3E503B8439b'; // Địa chỉ của contract
  await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0], to: itemManagerAddress });
};
// handleSubmit = async () => {
//   const { cost, itemName } = this.state;
//   const itemManagerAddress = '0xc706e3aeA7d96bCCc08bf7ad03e737f68D232860'; // Địa chỉ của contract
//   const receipt = await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0], to: itemManagerAddress });

//   // Trích xuất thông tin từ transaction receipt
//   const itemAddress = receipt.events.SupplyChainStep.returnValues._itemAddress;
//   console.log (itemAddress);

//   alert("Send "+cost+" Wei to "+itemAddress);
// };

//   listenToPaymentEvent = () => {
//   let self = this;
//   this.itemManager.events.SupplyChainStep().on("data", async function(evt){
//     console.log(evt);
//     let itemObject = await self.itemManager.methods.items(evt.receipt._itemIndex).call();
//     console.log("itemObject:", itemObject); // Kiểm tra giá trị của itemObject
//     alert("Item "+itemObject._identifier+" was paid, deliver it now");
//   });
// }

  render(){
    if (!this.state.loaded){
      return <div>loading web3, accounts, and contract...</div>;
    }
    return(
      <div className='App'>
  <h1>My Supply Chain!</h1>
  <h2>Add Items</h2>
  <p>Cost in Wei: <input type='text' name='cost' value={this.state.cost} onChange={(event) => this.handleInputChange(event)} /></p>
  <p>Item Identifier: <input type='text' name='itemName' value={this.state.itemName} onChange={(event) => this.handleInputChange(event)} /></p>
  <button type='button' onClick={this.handleSubmit}>Create new Item</button>
</div>

    );
  }
}

export default App;