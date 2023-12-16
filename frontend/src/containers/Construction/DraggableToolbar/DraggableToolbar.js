import { useState } from "react";
import Draggable from "react-draggable"

const DraggableToolbar = ({onClick}) => {

    const [drawType, setDrawType] = useState("");
    const handleDrawType = (type) => {
        setDrawType(type);
        onClick(type);
    }

    return (
        <Draggable>
            <div className="draggbletoolbar">
                <div className={drawType === "cursor" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} style={{textAlign: "center"}} onClick={() => handleDrawType("cursor")}>
                    <img src="./icon-cursor.svg" alt="cursor icon"></img>
                </div>
                <div 
                    className={drawType === "rect" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} 
                    style={{textAlign: "center"}} 
                    onClick={() => handleDrawType("rect")}
                >
                    <img src="./icon-rect.svg" alt="rect icon" />
                    <p style={{fontSize:"8px"}}>Rectangle</p>
                </div>
                <div className={drawType === "poly" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} style={{textAlign: "center"}} onClick={() => handleDrawType("poly")}>
                    <img src="./icon-poly.svg" alt="poly icon" ></img>
                    <p style={{fontSize:"8px"}}>Polygon</p>
                </div>

                <div className={drawType === "line" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} style={{textAlign: "center"}} onClick={() => handleDrawType("line")}>
                    <img src="./ruler.png" alt="length icon" ></img>
                    <p style={{fontSize:"8px"}}>Length</p>
                </div>
                <div className={drawType === "deduct" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} style={{textAlign: "center"}} onClick={() => handleDrawType("deduct")}>
                    <img src="./icon-deduct.svg" alt="deduct icon" ></img>
                    <p style={{fontSize:"8px"}}>Deduct</p>
                </div>
                <div className={drawType === "dot" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} style={{textAlign: "center"}} onClick={() => handleDrawType("dot")}>
                    <img src="./icon-search.svg" alt="count icon" ></img>
                    <p style={{fontSize:"8px"}}>Count</p>
                </div>
                <div className={drawType === "undo" ? "btn btn-toolbar type" : "btn btn-toolbar type-active"} style={{textAlign: "center"}} onClick={() => handleDrawType("undo")}>
                    <img src="./icon-undo.svg" alt="undo icon" ></img>
                    <p style={{fontSize:"8px"}}>Undo</p>
                </div>
            </div>
        </Draggable>
    )
}

export default DraggableToolbar;