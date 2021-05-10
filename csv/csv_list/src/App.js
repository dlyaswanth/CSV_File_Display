
import { useEffect, useState } from 'react';
import { Container, Grid, Header, List } from "semantic-ui-react";
import MaterialTable from 'material-table'
import './App.css';
var con=[]
function App(){
    const [content,setContent]=useState([])
    const [file,setFile]=useState('')
    function Submit()
    {
      fetch("/",{
          method:'post',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            file,
          })
        })
      .then(res=>res.json())
      .then(function(result){
        setContent(result)
        con=result
        })
    }
    useEffect(()=>{
      Submit()
  },[])
  const keys = [content.map(item=>(Object.keys(item)))]
  console.log(keys);
  const val=keys[0][0]
  const header=[]
  if (val!==undefined){
  val.forEach(ele=>{
      header.push({
        title:ele,
        field:ele,
      })
  })
}
  console.log(header)
  return (
    <div className="App">
      <header className="App-header">
        <div style={{alignItems:"center",alignSelf:"center",textAlign:"center"}}>
          <label>
            Select the CSV File 
          </label>
          <input type="file" value={file} accept={".csv"} onChange={(event)=>setFile(event.target.value)}/><br />
          <button onClick={Submit}>Submit</button>
        </div>
        <MaterialTable 
        title="CSV File Data" 
        columns={header}
        data={content}
        options={{
          search: false
        }}
        style={{alignContent:"center",marginLeft:"20%",maxWidth:"60%",marginTop:"5%"}}
        />
      </header>
    </div>
  );
}

export default App;
