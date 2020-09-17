import React, { Component } from "react";
import CardGroup from "./cardGroup";
import Combo from "./combo";
import "./deck.css";

class Deck extends Component {
  state = {
    handSize: 5,
    nextGroupNum: 1, //what Id to give the next group made
    nextComboNum: 1, //^but for combos
    groups: [{ num: 0, gName: "Deck", gSize: 40 }],
    combos: [{ num: 0 }], // cName: "Combo# 1"  clauses: [], prob: 0 }],
  };
  addGroup() {
    const newComps = [
      ...this.state.groups,
      { num: this.state.nextGroupNum, gName: "New Group", gSize: 0 },
    ];
    this.setState({
      nextGroupNum: this.state.nextGroupNum + 1,
      groups: newComps,
    });
  }
  addCombo() {
    const newCombos = [
      ...this.state.combos,
      {
        num: this.state.nextComboNum,
      },
    ];
    this.setState({
      nextComboNum: this.state.nextComboNum + 1,
      combos: newCombos,
    });
  }
  updateGroup(type, num) {
    let newText = document.getElementById(type + num).innerText;
    if (type === "gSize") {
      newText = parseInt(newText, 10);
    }
    let groupsTemp = this.state.groups.slice();
    const cardGroup = groupsTemp.findIndex((cg) => cg.num === num); //find the group that matches parameter num
    groupsTemp[cardGroup][type] = newText; //finds text in that groups html div
    document.getElementById(type + num).innerText = newText;

    this.setState({ groups: groupsTemp });
  }
  removeCombo(num) {
    let combosTemp = this.state.combos.slice();
    const cardGroup = combosTemp.findIndex((cg) => cg.num === num);
    combosTemp.splice(cardGroup, 1);
    this.setState({ combos: combosTemp });
  }
  toggleSecond() {
    this.setState({ handSize: this.state.handSize === 5 ? 6 : 5 }); //alternates between 5 and 6
  }
  render() {
    const grouplist = this.state.groups.map((item) => {
      //list of group elements to be displayed
      const { num, gName, gSize } = item;
      return (
        <CardGroup
          key={num}
          num={num}
          gName={gName}
          gSize={gSize}
          update={(type) => this.updateGroup(type, num)}
        />
      );
    });
    var leftover = this.state.groups[0].gSize * 2; //starts at double decksize and minuses all additions(including decksize)
    this.state.groups.forEach((obj) => {
      leftover = leftover - obj.gSize;
    });
    //list of combo elements to be displayed
    const combolist = this.state.combos.map((item) => {
      const { num } = item;
      return (
        <Combo
          key={num}
          num={num}
          groups={this.state.groups}
          handSize={this.state.handSize}
          kill={() => this.removeCombo(num)}
        />
      );
    });
    return (
      <React.Fragment>
        <div className="groups">{grouplist}</div>
        <button onClick={() => this.addGroup()}>Add Group</button>
        <div>Other cards: {leftover}</div>
        <div className="checkbox">
          <input
            type="checkbox"
            onClick={() => this.toggleSecond()}
            name="Second"
            value="Second"
          />
          <label> Going Second</label>
        </div>
        <button onClick={() => this.addCombo()}>Add Combo</button>
        <div className="combos">{combolist}</div>
      </React.Fragment>
    );
  }
}

export default Deck;
