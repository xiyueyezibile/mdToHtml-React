import mdToHtml from "../utils/mdToHtml";
import "./App.css";

function App() {
  return <>{mdToHtml("# 这是示范 ![wd](ssss)\n## 我是h2 **wdasd**")}</>;
}

export default App;
