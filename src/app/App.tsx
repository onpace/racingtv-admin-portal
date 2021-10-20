import React, { useEffect, useState } from "react";
import "./App.css";
import { getMessage } from "./Client";

function App() {
  const [msg, setMsg] = useState("Loading");

  useEffect(() => {
    getMessage()
      .then(setMsg)
      .catch((err) => setMsg(err.message || "Error"));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <code>{msg}</code>
        </p>
      </header>
    </div>
  );
}

export default App;
