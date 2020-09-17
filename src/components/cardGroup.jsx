import React, { Component } from "react";
class CardGroup extends Component {
  //state = {  }
  adjustSize(amount) {
    let size = document.getElementById("gSize" + this.props.num);
    size.innerHTML = parseInt(size.innerHTML, 10) + amount;
    this.props.update("gSize");
  }
  render() {
    const { num, gName, gSize, update } = this.props;
    return (
      <React.Fragment>
        <li className="cardGroup" key={"li" + num} id={num}>
          <div
            className="gName"
            key={"gName" + num}
            id={"gName" + num}
            contentEditable="true"
            onBlur={() => update("gName")}
            suppressContentEditableWarning={true}
          >
            {gName}
          </div>
          <div className="gNumber">
            <button
              key={"plus" + num}
              className="button"
              onClick={() => this.adjustSize(1)}
            >
              +
            </button>
            <div
              className="gSize"
              key={"gSize" + num}
              id={"gSize" + num}
              contentEditable="true"
              pattern="[0-9]"
              onBlur={() => update("gSize")}
              suppressContentEditableWarning={true}
            >
              {gSize}
            </div>{" "}
            <button
              key={"minus" + num}
              className="button"
              onClick={() => this.adjustSize(-1)}
            >
              -
            </button>
          </div>
        </li>
      </React.Fragment>
    );
  }
}

export default CardGroup;
