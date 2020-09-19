import React, { Component } from "react";
import "./clause.css";

class Clause extends Component {
  state = { TypeDropdown: false, GroupDropdown: false };
  toggleState(type) {
    if (type) {
      this.setState({ TypeDropdown: !this.state.TypeDropdown });
    } else {
      this.setState({ TypeDropdown: !this.state.GroupDropdown });
    }
  }
  render() {
    const { num, type, group, size, groups, update, kill } = this.props;
    const typeText = ["Exactly ", "No ", "At least ", "At most "];
    console.log(size);
    const groupName = group
      ? groups.find((cg) => cg.num === group).gName
      : "...";
    const groupNames = groups.slice(1).map((item) => {
      return (
        <button
          className="option"
          key={"gOption " + num + ":" + item.num}
          onClick={() => update("group", item.num)}
        >
          {item.gName}
        </button>
      );
    });
    return (
      <React.Fragment>
        <div className="clause" key={num}>
          <button className="delete" onClick={() => kill()}>
            x
          </button>
          <div className="dropdown" key={"tDDWrapper" + num}>
            <button
              className="clauseType"
              key={"tButon" + num}
              onClick={() => this.toggleState()}
            >
              {typeText[type]}
            </button>
            {true && (
              <div
                id={"typeDropDown"}
                key={"tDD" + num}
                className={"dropdown-content"}
              >
                <button
                  className="option"
                  key={"tOption " + num + ":" + 0}
                  onClick={() => update("type", 0)}
                >
                  {typeText[0]}
                </button>
                <button
                  className="option"
                  key={"tOption " + num + ":" + 1}
                  onClick={() => update("type", 1)}
                >
                  {typeText[1]}
                </button>
                <button
                  className="option"
                  key={"tOption " + num + ":" + 2}
                  onClick={() => update("type", 2)}
                >
                  {typeText[2]}
                </button>
                <button
                  className="option"
                  key={"tOption " + num + ":" + 3}
                  onClick={() => update("type", 3)}
                >
                  {typeText[3]}
                </button>
              </div>
            )}
          </div>
          {type !== 1 && (
            <div
              className="clauseNum"
              id={"clauseNum" + num}
              contentEditable="true"
              onBlur={() =>
                update(
                  "size",
                  document.getElementById("clauseNum" + num).innerText
                )
              }
              suppressContentEditableWarning={true}
            >
              {size}
            </div>
          )}
          <div className="dropdown" key={"gDDWrapper" + num}>
            <button
              className="clauseType"
              key={"gButon" + num}
              onClick={() => this.toggleState()}
            >
              {groupName}
            </button>
            <div
              id={"typeDropDown"}
              key={"gDD" + num}
              className={"dropdown-content"}
            >
              {groupNames}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Clause;
