import React from "react";

function CharacterTile(props) {
  console.log(props);
  return (
    <div key={props.id} className="card">
        <div className="card-body">
            <h5 className="card-title">{props.name}</h5>
            <p className="card-text">{"Level: " + props.level +" / " + props.class +  "/ " + props.race}
        </p>
            <button
                onClick={props.onClick}
                id={props.id}
                className="btn btn-danger" style={{backgroundColor: "purple", borderBlockColor: "purple", color: "white"}}>Go to Character</button>
        </div>
    </div>
  );
}

export default CharacterTile;