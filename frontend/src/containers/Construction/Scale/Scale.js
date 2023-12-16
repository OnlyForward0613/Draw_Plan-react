const Scale = (props) => {

    return (
        <div id="set-scale">
            <hr></hr>
            <div>PAGE SETTINGS</div>
            <hr />
            <div className="page_setting row">
                <p className="col-md-5" style={{fontSize: "12px", marginBottom:0}}>Page Size</p>
                <input 
                    className="col-md-7 text-center"
                    type="text"
                    disabled
                    value={props.pageSize} />
            </div>
            <div className="page_setting row">
                <p className="col-md-5" style={{fontSize:"12px", marginBottom:0}}>Page scale</p>
                <input 
                    className="col-md-7 text-center" 
                    type="text" 
                    readOnly 
                    value = {"1 : " + props.pageScale}
                    id ="scale"  />            
            </div>
            <button className="btn btn-primary" onClick={() => props.onClick()}>Change Scale</button>
        </div>
    )
}

export default Scale;