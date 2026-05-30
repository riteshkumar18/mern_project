import {useEffect,useState} from "react";
import axios from "axios";
import Card from "./components/Card";

function App(){

const [products,setProducts]= useState([]);
const[editId,setEditId]= useState(null);
const[name,setName]= useState("");
const[price,setPrice]= useState("");

 useEffect(()=>{
  axios.get("http://localhost:5000/products")
  .then((res)=>{
    setProducts(res.data);
  }).catch((err)=>{
    console.log(err);
  })
 },[]);

const handleDelete= async(id)=>{
  try{
     await axios.delete(
       `http://localhost:5000/products/${id}`
     )

     setProducts(
      products.filter((item)=>{
        return  item._id !== id;
      })
     );
  }catch(err){
    console.log(err);
  }
}

const handleUpdate= async()=>{
     try{
        await axios.put(
          `http://localhost:5000/products/${editId}`,
          {
            name,
            price,
          }
        );

        window.location.reload();
     }catch(err){
      console.log(err);
     }
}



  return (

    <div>
       <h1>Products</h1>

        {products.map((item)=>{
          return(
             <div key={item._id}>
          <Card
           name= {item.name}
           price= {item.price}
          />

       <button onClick={
        ()=>{
          setEditId(item._id);
          setName(item.name);
          setPrice(item.price);
        }
       }>  
        Edit
        </button> 

        <button onClick={()=>handleDelete(item._id)}>Delete</button>

</div>
        );
        })}

        {editId && (
          <div>
            <h1>Update form</h1>
            <input
            type="text"
            value={name}
            placeholder="Enter the name"
            onChange={(e)=>{
               setName(e.target.value);
            }}
            />
            <input
            type="Number"
            value={price}
            placeholder="Enter the price"
            onChange= {()=>{
              setPrice(e.target.value);
            }}
            />
            <button onClick={handleUpdate}>
              Save
            </button>
          </div>
        )}
    </div>

  );
}

export default App;