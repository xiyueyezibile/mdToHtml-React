import { useState } from "react";
import mdToHtml from "../utils/mdToHtml";
import "./App.css";

function App() {
  const [value,setValue] = useState()
  return <><textarea style={{width:"50vw",height:"400px"}} value={value} onChange={(e)=>{
    setValue(e.target.value)
  }}></textarea><br /> {value?mdToHtml(value):undefined}</>;
}

export default App;
