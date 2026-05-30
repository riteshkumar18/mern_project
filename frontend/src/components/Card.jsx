function Card(props){
    return (
        
        <div style={{
            border: "1px solid black",
            padding: "10px",
            margin:"10px",
            width: "200px"
        }}>
         
         <h1>{props.name}</h1>
         <p>₹{props.price}</p>
         </div>
    );
}

export default Card;