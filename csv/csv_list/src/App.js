
import { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import './App.css';
var content=[]
function App(){
    const [file,setFile]=useState('')
    useEffect(()=>{
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
    .then(result=>{
      console.log(result)
      content=result
      console.log(content)
    })
    })
  return (
    <div className="App">
      <header className="App-header">
        <label>
          Select the CSV File 
        </label>
        <input type="file" value={file} onChange={(event)=>setFile(event.target.value)}/>
        <button>Submit</button>
        {content.map(d=><li key={d.Game_Number}>{d}</li>)}
        <h4>Heloo</h4>
      </header>
    </div>
  );
}

export default App;
