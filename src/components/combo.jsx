import React, { Component } from "react";
import Clause from "./clause";

class Combo extends Component {
  state = {
    nextClause: 0,
    cName: "Combo# " + (this.props.num + 1),
    clauses: [],
    prob: 0,
  };
  addclause() {
    const newClauses = [
      ...this.state.clauses,
      { num: this.state.nextClause, type: 0, group: 0, size: 1 },
    ];
    this.setState({
      clauses: newClauses,
      nextClause: this.state.nextClause + 1,
    });
  }
  updateClause(num, field, value) {
    //sanitizes input if its a number
    if (field === "size") {
      value = parseInt(value, 10);
      if (value > 99) value = 99; //should add alerts when capping extreme values
      if (value < 0) value = 0;
    }
    let clausesTemp = this.state.clauses.slice();
    const clause = clausesTemp.findIndex((cg) => cg.num === num);
    clausesTemp[clause][field] = value;
    this.setState({ clauses: clausesTemp }, () => this.calculateProb()); //might be able to remove func call
  }
  removeClause(num) {
    let clausesTemp = this.state.clauses.slice();
    const clause = clausesTemp.findIndex((cg) => cg.num === num);
    clausesTemp.splice(clause, 1);
    this.setState({ clauses: clausesTemp }, () => this.calculateProb()); //might be able to remove func call
  }
  calculateProb() {
    const { clauses, prob } = this.state;
    const { groups, handSize } = this.props;

    //prepare values used for recursive calculation
    let newProb = 0;
    const validClauses = clauses.filter((item) => item.group); //checks that group is not 0
    const values = validClauses.map((item) => {
      let min = 0;
      let max = 0;
      switch (item.type) {
        default:
        case 0: //excactly
          min = item.size;
          max = item.size;
          break;
        case 1: //none
          min = 0;
          max = 0;
          break;
        case 2: //at least
          min = item.size;
          max = handSize;
          break;
        case 3: //at most
          min = 0;
          max = item.size;
          break;
      }
      const myGroup = groups.find((group) => group.num === item.group);
      return {
        group: item.group,
        amt: myGroup.gSize,
        min: min,
        max: max,
      };
    });
    //handle two clauses for same group, probably can be done more efficiently
    let finalValues = [];
    let foundGroups = [];
    values.forEach((item) => {
      if (foundGroups.indexOf(item.group) === -1) {
        values
          .filter((innerItem) => innerItem.group === item.group)
          .forEach((innerItem) => {
            if (innerItem.min > item.min) item.min = innerItem.min;
            if (innerItem.max < item.max) item.max = innerItem.max;
          });
        finalValues.push(item);
        foundGroups.push(item.group);
      }
    });

    //find number of cards in deck not in any groups
    let remainder = groups[0].gSize;
    finalValues.forEach((item) => (remainder -= item.amt));

    //uses recursion to calculate probability
    let temp = this.recursion(handSize, finalValues, remainder);
    newProb = temp.val / choose(groups[0].gSize, handSize);

    if (newProb !== prob) this.setState({ prob: newProb });
  }
  recursion(remainingCards, objects, remainder) {
    if (remainingCards < 0) return { string: "0", val: 0 };
    //if (remainingCards === 0) return { string: "1", val: 1 };

    if (objects.length === 0) {
      return {
        string: remainder + " c " + remainingCards,
        val: choose(remainder, remainingCards),
      };
    }
    let curObject = objects.pop();
    let prob = 0;
    let mytext = "";
    for (
      let i = curObject.min;
      i <= curObject.max && i <= remainingCards;
      i++
    ) {
      mytext += curObject.amt + " c " + i + "(";
      let temp = choose(curObject.amt, i);
      let rec = this.recursion(
        parseInt(remainingCards) - i,
        objects,
        remainder
      );
      temp *= rec.val;
      prob += temp;
      if (rec.val !== 0) mytext += rec.string;
      mytext += ") +";
    }
    objects.push(curObject);
    return { string: mytext, val: prob };
  }
  render() {
    const { num, groups, kill } = this.props;
    const { cName, prob } = this.state;
    this.calculateProb(); //This might cause a ton of lag also gives me warnings
    const clauses = this.state.clauses.map((clause) => {
      return (
        <Clause
          num={clause.num}
          key={clause.num}
          type={clause.type}
          group={clause.group}
          size={clause.size}
          groups={groups}
          update={(field, value) => this.updateClause(clause.num, field, value)}
          kill={() => this.removeClause(clause.num)}
        />
      );
    });

    return (
      <React.Fragment>
        <li className="combo" key={"comboli" + num} id={num}>
          <div className="comboStart">
            <button className="delete cDelete" onClick={() => kill()}>
              x
            </button>
            <div
              className="cName"
              key={"cName" + num}
              id={"cName" + num}
              contentEditable="true"
              onBlur={() =>
                this.setState({
                  cName: document.getElementById("cName" + num).innerText,
                })
              }
              suppressContentEditableWarning={true}
            >
              {cName}
            </div>
          </div>
          <div className="clauses" key={"clauses" + num} id={"clauses" + num}>
            {clauses}
            <button className="clauseButton" onClick={() => this.addclause()}>
              +
            </button>
          </div>
          <div className="cProb" key={"cProb" + num} id={"cProb" + num}>
            {(prob * 100).toPrecision(3) + "%"}
          </div>
        </li>
      </React.Fragment>
    );
  }
}
function factorial(x) {
  x = parseInt(x, 10);
  if (isNaN(x)) return 1;
  if (x <= 0) return 1;
  if (x > 170) return Infinity;
  var y = 1;
  for (var i = x; i > 0; i--) {
    y *= i;
  }
  return y;
}
function choose(n, k) {
  //console.log("n:" + n + " k:" + k);
  n = parseInt(n, 10);
  if (isNaN(n)) n = 0;
  if (n < 0) n = 0;

  k = parseInt(k, 10);
  if (isNaN(k)) k = 0;
  if (k < 0) k = 0;
  if (k > n) return 0;
  let answer = Math.round(factorial(n) / (factorial(k) * factorial(n - k)));
  //console.log(answer);

  return answer;
}

export default Combo;
